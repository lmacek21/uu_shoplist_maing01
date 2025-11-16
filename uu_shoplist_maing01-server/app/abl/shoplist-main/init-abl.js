"use strict";
const Crypto = require("crypto");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { AuthenticationService } = require("uu_appg01_server").Authentication;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { UuDateTime } = require("uu_i18ng01");
const { ConsoleClient, ProgressClient } = require("uu_consoleg02-uulib");

const Errors = require("../../api/errors/shoplist-main-error");
const Warnings = require("../../api/warnings/shoplist-main-warning");
const Validator = require("../../components/validator");
const DtoBuilder = require("../../components/dto-builder");
const ScriptEngineClient = require("../../components/script-engine-client");
const ShoplistMainClient = require("../../components/shoplist-main-client");
const StepHandler = require("../../components/step-handler");
const InitRollbackAbl = require("./init-rollback-abl");

const ConsoleConstants = require("../../constants/console-constants");
const ProgressConstants = require("../../constants/progress-constants");
const ShoplistMainConstants = require("../../constants/shoplist-main-constants");
const Configuration = require("../../components/configuration");

const SCRIPT_CODE = "uu_shoplist_maing01-uuscriptlib/shoplist-main/init";

class InitAbl {
  constructor() {
    this.dao = DaoFactory.getDao(ShoplistMainConstants.Schemas.SHOPLIST_INSTANCE);
  }

  async init(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    this._validateDtoIn(uri, dtoIn);

    // HDS 2
    let uuShoplist = await this.dao.getByAwid(awid);
    let uuAppWorkspace = await UuAppWorkspace.get(awid);

    // HDS 3
    this._validateMode(uuShoplist, dtoIn, uuAppWorkspace.sysState);

    // HDS 4
    const configuration = await Configuration.getUuSubAppConfiguration({
      awid,
      artifactId: dtoIn.data.locationId || uuShoplist.temporaryData.dtoIn.locationId,
      uuTerritoryBaseUri: dtoIn.data.uuTerritoryBaseUri || uuShoplist.temporaryData.dtoIn.uuTerritoryBaseUri,
    });

    // HDS 5
    let initData;
    switch (dtoIn.mode) {
      case ShoplistMainConstants.ModeMap.STANDARD: {
        initData = dtoIn.data;
        const uuTerritoryBaseUri = this._parseTerritoryUri(initData.uuTerritoryBaseUri);
        const temporaryData = {
          useCase: uri.getUseCase(),
          dtoIn: { ...initData },
          stepList: [ShoplistMainConstants.InitStepMap.SHOPLIST_OBJECT_CREATED.code],
          progressMap: {
            uuConsoleUri: configuration.uuConsoleBaseUri,
            progressCode: ShoplistMainConstants.getInitProgressCode(awid),
            consoleCode: ShoplistMainConstants.getMainConsoleCode(awid),
          },
        };

        uuShoplist = await this.dao.create({
          awid,
          state: ShoplistMainConstants.StateMap.CREATED,
          code: `${ShoplistMainConstants.AWSC_PREFIX}/${awid}`,
          uuTerritoryBaseUri: uuTerritoryBaseUri.toString(),
          name: initData.name,
          desc: initData.desc,
          temporaryData,
        });

        try {
          await UuAppWorkspace.setBeingInitializedSysState(awid);
        } catch (e) {
          throw new Errors.Init.SetBeingInitializedSysStateFailed({}, e);
        }
        break;
      }

      case ShoplistMainConstants.ModeMap.RETRY: {
        initData = uuShoplist.temporaryData.dtoIn;
        break;
      }

      case ShoplistMainConstants.ModeMap.ROLLBACK: {
        uuShoplist.temporaryData.rollbackMode = true;
        if (!uuShoplist.temporaryData.rollbackStepList) {
          uuShoplist.temporaryData.rollbackStepList = [];
        }
        uuShoplist = await this.dao.updateByAwid({ ...uuShoplist });
        initData = uuShoplist.temporaryData.dtoIn;
        break;
      }

      default: {
        throw new Errors.Init.WrongModeAndCircumstances({
          mode: dtoIn.mode,
          appObjectState: uuShoplist?.state,
          temporaryData: uuShoplist?.temporaryData,
        });
      }
    }

    // HDS 6
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const lockSecret = Crypto.randomBytes(32).toString("hex");
    const progressClient = await this._createInitProgress(
      uuShoplist,
      dtoIn,
      configuration,
      lockSecret,
      sysIdentitySession,
    );

    // HDS 7
    switch (dtoIn.mode) {
      case ShoplistMainConstants.ModeMap.STANDARD:
      case ShoplistMainConstants.ModeMap.RETRY: {
        const stepHandler = new StepHandler({
          schema: ShoplistMainConstants.Schemas.SHOPLIST_INSTANCE,
          progressClient,
          stepList: uuShoplist?.temporaryData?.stepList,
        });

        const shoplistMainClient = new ShoplistMainClient(uuShoplist, uuShoplist.uuTerritoryBaseUri);

        uuShoplist = await stepHandler.handleStep(uuShoplist, ShoplistMainConstants.InitStepMap.AWSC_CREATED, async () => {
          uuShoplist.state = ShoplistMainConstants.StateMap.BEING_INITIALIZED;
          await this.dao.updateByAwid({ ...uuShoplist });
          await shoplistMainClient.createAwsc(
            initData.locationId,
            initData.responsibleRoleId,
            initData.permissionMatrix,
            configuration.uuAppMetaModelVersion,
          );
        });

        uuShoplist = await stepHandler.handleStep(uuShoplist, ShoplistMainConstants.InitStepMap.WS_CONNECTED, async () => {
          await this._connectAwsc(uuShoplist, uri.getBaseUri(), uuShoplist.uuTerritoryBaseUri, sysIdentitySession);
        });

        uuShoplist = await stepHandler.handleStep(uuShoplist, ShoplistMainConstants.InitStepMap.CONSOLE_CREATED, async () => {
          await this._createConsole(uuShoplist, configuration, sysIdentitySession);
        });

        // TODO If your application requires any additional steps, add them here...

        if (!uuShoplist.temporaryData.stepList.includes(ShoplistMainConstants.InitStepMap.PROGRESS_ENDED.code)) {
          await this._runScript(uri.getBaseUri(), configuration, lockSecret, sysIdentitySession);
        } else {
          await this._initFinalize(uri, { lockSecret });
        }
        break;
      }

      case ShoplistMainConstants.ModeMap.ROLLBACK: {
        if (
          uuShoplist.temporaryData.stepList.includes(ShoplistMainConstants.InitStepMap.CONSOLE_CREATED.code) &&
          !uuShoplist.temporaryData.rollbackStepList.includes(ShoplistMainConstants.InitRollbackStepMap.CONSOLE_CLEARED.code)
        ) {
          await InitRollbackAbl.initRollback(uri.getBaseUri(), configuration, lockSecret);
        } else {
          await InitRollbackAbl._initFinalizeRollback(uri, { lockSecret });
        }
        break;
      }

      default: {
        throw new Errors.Init.WrongModeAndCircumstances({
          mode: dtoIn.mode,
          appObjectState: uuShoplist?.state,
          temporaryData: uuShoplist?.temporaryData,
        });
      }
    }

    // HDS 8
    return DtoBuilder.prepareDtoOut({ data: uuShoplist });
  }

  async _initFinalize(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    Validator.validateDtoInCustom(uri, dtoIn, "sysUuAppWorkspaceInitFinalizeDtoInType");

    // HDS 2
    let uuShoplist = await this.dao.getByAwid(awid);

    if (!uuShoplist) {
      // 2.1
      throw new Errors._initFinalize.UuShoplistDoesNotExist({ awid });
    }

    if (![ShoplistMainConstants.StateMap.BEING_INITIALIZED, ShoplistMainConstants.StateMap.ACTIVE].includes(uuShoplist.state)) {
      // 2.2
      throw new Errors._initFinalize.NotInProperState({
        state: uuShoplist.state,
        expectedStateList: [ShoplistMainConstants.StateMap.BEING_INITIALIZED, ShoplistMainConstants.StateMap.ACTIVE],
      });
    }

    // HDS 3
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const progress = {
      code: ShoplistMainConstants.getInitProgressCode(uuShoplist.awid),
      lockSecret: dtoIn.lockSecret,
    };
    let progressClient = null;
    if (!uuShoplist.temporaryData.stepList.includes(ShoplistMainConstants.InitStepMap.PROGRESS_ENDED.code)) {
      progressClient = await ProgressClient.get(uuShoplist.temporaryData.progressMap.uuConsoleUri, progress, {
        session: sysIdentitySession,
      });
    }
    const stepHandler = new StepHandler({
      schema: ShoplistMainConstants.Schemas.SHOPLIST_INSTANCE,
      progressClient,
      stepList: uuShoplist.temporaryData.stepList,
    });

    // TODO If your application requires any additional steps, add them here...

    // HDS 4
    uuShoplist = await stepHandler.handleStep(
      uuShoplist,
      ShoplistMainConstants.InitStepMap.PROGRESS_ENDED,
      async () => {
        await progressClient.end({
          state: ProgressConstants.StateMap.COMPLETED,
          message: "Initialization finished.",
          doneWork: ShoplistMainConstants.getInitStepCount(),
        });
      },
      false,
    );

    // HDS 5
    if (uuShoplist.state === ShoplistMainConstants.StateMap.BEING_INITIALIZED) {
      uuShoplist = await this.dao.updateByAwid({ awid, state: ShoplistMainConstants.StateMap.ACTIVE, temporaryData: null });
    }

    // HDS 6
    await UuAppWorkspace.setActiveSysState(awid);

    // HDS 7
    return DtoBuilder.prepareDtoOut({ data: uuShoplist });
  }

  // Validates dtoIn. In case of standard mode the data key of dtoIn is also validated.
  _validateDtoIn(uri, dtoIn) {
    let uuAppErrorMap = Validator.validateDtoIn(uri, dtoIn);
    if (dtoIn.mode === ShoplistMainConstants.ModeMap.STANDARD) {
      Validator.validateDtoInCustom(uri, dtoIn.data, "sysUuAppWorkspaceInitStandardDtoInType", uuAppErrorMap);
    }
    return uuAppErrorMap;
  }

  _validateMode(uuShoplist, dtoIn, sysState) {
    switch (dtoIn.mode) {
      case ShoplistMainConstants.ModeMap.STANDARD:
        if (![UuAppWorkspace.SYS_STATES.ASSIGNED, UuAppWorkspace.SYS_STATES.BEING_INITIALIZED].includes(sysState)) {
          // 3.A.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.ASSIGNED, UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (uuShoplist) {
          // 3.A.2.1.
          throw new Errors.Init.UuShoplistObjectAlreadyExist({
            mode: dtoIn.mode,
            allowedModeList: [ShoplistMainConstants.ModeMap.RETRY, ShoplistMainConstants.ModeMap.ROLLBACK],
          });
        }
        break;

      case ShoplistMainConstants.ModeMap.RETRY:
        if (sysState !== UuAppWorkspace.SYS_STATES.BEING_INITIALIZED) {
          // 3.B.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (!uuShoplist?.temporaryData) {
          // 3.B.2.1.
          throw new Errors.Init.MissingRequiredData();
        }
        if (uuShoplist?.temporaryData?.rollbackMode) {
          // 3.B.3.1.
          throw new Errors.Init.RollbackNotFinished();
        }
        break;

      case ShoplistMainConstants.ModeMap.ROLLBACK:
        if (sysState !== UuAppWorkspace.SYS_STATES.BEING_INITIALIZED) {
          // 3.C.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (!uuShoplist?.temporaryData) {
          // 3.C.2.1.
          throw new Errors.Init.MissingRequiredData();
        }
        if (!dtoIn.force && uuShoplist?.temporaryData?.rollbackMode) {
          // 3.C.3.1.
          throw new Errors.Init.RollbackAlreadyRunning();
        }
        break;
    }
  }

  _parseTerritoryUri(locationUri) {
    let uuTerritoryUri;

    try {
      uuTerritoryUri = UriBuilder.parse(locationUri).toUri();
    } catch (e) {
      throw new Errors.Init.UuTLocationUriParseFailed({ uri: locationUri }, e);
    }

    return uuTerritoryUri.getBaseUri();
  }

  async _createInitProgress(uuShoplist, dtoIn, config, lockSecret, session) {
    let progressClient;
    let progress = {
      expireAt: UuDateTime.now().shift("day", 7),
      name: ShoplistMainConstants.getInitProgressName(uuShoplist.awid),
      code: ShoplistMainConstants.getInitProgressCode(uuShoplist.awid),
      authorizationStrategy: "uuIdentityList",
      permissionMap: await this._getInitProgressPermissionMap(uuShoplist.awid, session),
      lockSecret,
    };

    try {
      progressClient = await ProgressClient.get(config.uuConsoleBaseUri, { code: progress.code }, { session });
    } catch (e) {
      if (e.cause?.code !== ProgressConstants.PROGRESS_DOES_NOT_EXIST) {
        throw new Errors.Init.ProgressGetCallFailed({ progressCode: progress.code }, e);
      }
    }

    if (!progressClient) {
      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.Init.ProgressCreateCallFailed({ progressCode: progress.code }, e);
      }
    } else if (dtoIn.force) {
      try {
        await progressClient.releaseLock();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_RELEASE_DOES_NOT_EXIST) {
          throw new Errors.Init.ProgressReleaseLockCallFailed({ progressCode: progress.code }, e);
        }
      }

      try {
        await progressClient.setState({ state: "cancelled" });
      } catch (e) {
        DtoBuilder.addWarning(new Warnings.Init.ProgressSetStateCallFailed(e.cause?.paramMap));
      }

      try {
        await progressClient.delete();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_DELETE_DOES_NOT_EXIST) {
          throw new Errors.Init.ProgressDeleteCallFailed({ progressCode: progress.code }, e);
        }
      }

      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.Init.ProgressCreateCallFailed({ progressCode: progress.code }, e);
      }
    }

    try {
      await progressClient.start({
        message: "Progress was started",
        totalWork:
          dtoIn.mode === ShoplistMainConstants.ModeMap.ROLLBACK
            ? ShoplistMainConstants.getInitRollbackStepCount()
            : ShoplistMainConstants.getInitStepCount(),
        lockSecret,
      });
    } catch (e) {
      throw new Errors.Init.ProgressStartCallFailed({ progressCode: progress.code }, e);
    }

    return progressClient;
  }

  async _getInitProgressPermissionMap(awid, sysIdentitySession) {
    const awidData = await UuAppWorkspace.get(awid);

    let permissionMap = {};
    for (let identity of awidData.awidInitiatorList) {
      permissionMap[identity] = ShoplistMainConstants.CONSOLE_BOUND_MATRIX.Authorities;
    }
    permissionMap[sysIdentitySession.getIdentity().getUuIdentity()] =
      ShoplistMainConstants.CONSOLE_BOUND_MATRIX.Authorities;

    return permissionMap;
  }

  async _connectAwsc(uuShoplist, appUri, uuTerritoryBaseUri, session) {
    const artifactUri = UriBuilder.parse(uuTerritoryBaseUri).setParameter("id", uuShoplist.artifactId).toUri().toString();

    try {
      await UuAppWorkspace.connectArtifact(appUri, { artifactUri }, session);
    } catch (e) {
      throw new Errors.ShoplistMain.ConnectAwscFailed(
        {
          awid: uuShoplist.awid,
          awscId: uuShoplist.artifactId,
          uuTerritoryBaseUri,
        },
        e,
      );
    }
  }

  async _createConsole(uuShoplist, configuration, session) {
    const artifactUri = UriBuilder.parse(uuShoplist.uuTerritoryBaseUri).setParameter("id", uuShoplist.artifactId).toString();
    const console = {
      code: ShoplistMainConstants.getMainConsoleCode(uuShoplist.awid),
      authorizationStrategy: "boundArtifact",
      boundArtifactUri: artifactUri,
      boundArtifactPermissionMatrix: ShoplistMainConstants.CONSOLE_BOUND_MATRIX,
    };

    try {
      await ConsoleClient.createInstance(configuration.uuConsoleBaseUri, console, { session });
    } catch (e) {
      throw new Errors.Init.FailedToCreateConsole({}, e);
    }
  }

  async _setConsoleExpiration(uuConsoleUri, consoleCode, session) {
    let consoleClient;
    try {
      consoleClient = await ConsoleClient.get(uuConsoleUri, { code: consoleCode }, { session });
    } catch (e) {
      if (e.cause?.code === ConsoleConstants.CONSOLE_GET_DOES_NOT_EXISTS) {
        throw new Errors._initFinalize.ConsoleGetCallFailed({ code: consoleCode }, e);
      }
    }

    try {
      await consoleClient.update({ expireAt: new UuDateTime().shift("day", 7).date });
    } catch (e) {
      if (e.cause?.code === ConsoleConstants.CONSOLE_UPDATE_DOES_NOT_EXISTS) {
        DtoBuilder.addWarning(new Warnings._initFinalize.ConsoleDoesNotExist({ code: consoleCode }));
      } else {
        throw new Errors._initFinalize.ConsoleUpdateCallFailed({ code: consoleCode }, e);
      }
    }
  }

  async _runScript(appUri, configuration, lockSecret, session) {
    const scriptEngineClient = new ScriptEngineClient({
      scriptEngineUri: configuration.uuScriptEngineBaseUri,
      consoleUri: configuration.uuConsoleBaseUri,
      consoleCode: ShoplistMainConstants.getMainConsoleCode(appUri.getAwid()),
      scriptRepositoryUri: configuration.uuScriptRepositoryBaseUri,
      session,
    });

    const scriptDtoIn = {
      uuShoplistUri: appUri.toString(),
      lockSecret,
    };

    await scriptEngineClient.runScript({ scriptCode: SCRIPT_CODE, scriptDtoIn });
  }
}

module.exports = new InitAbl();
