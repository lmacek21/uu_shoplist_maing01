"use strict";
const { UseCaseContext } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuTerrClient } = require("uu_territory_clientg01");

const TerritoryConstants = require("../constants/territory-constants");
const DtoBuilder = require("./dto-builder");
const { ShoplistMain: Errors } = require("../api/errors/shoplist-main-error");
const Warnings = require("../api/warnings/shoplist-main-warning");
const ShoplistMainConstants = require("../constants/shoplist-main-constants");

class ShoplistMainClient {
  constructor(uuShoplist, territoryUri = null, session = null) {
    this.dao = DaoFactory.getDao(ShoplistMainConstants.Schemas.SHOPLIST_INSTANCE);
    this.uuShoplist = uuShoplist;
    this.uri = UseCaseContext.getUri();
    this.territoryUri = territoryUri ? territoryUri : uuShoplist.uuTerritoryBaseUri;
    this.session = session ? session : UseCaseContext.getSession();
  }

  async createAwsc(location, responsibleRole, permissionMatrix, uuAppMetaModelVersion) {
    const appClientOpts = this.getAppClientOpts();
    const { name, desc } = this.uuShoplist;
    const awscCreateDtoIn = {
      name,
      desc,
      code: `${ShoplistMainConstants.AWSC_PREFIX}/${this.uuShoplist.awid}`,
      location,
      responsibleRole,
      permissionMatrix,
      typeCode: ShoplistMainConstants.UUAPP_CODE,
      uuAppWorkspaceUri: this.uri.getBaseUri(),
      uuAppMetaModelVersion,
    };

    let awsc;
    try {
      awsc = await UuTerrClient.Awsc.create(awscCreateDtoIn, appClientOpts);
    } catch (e) {
      const awscCreateErrorMap = (e.dtoOut && e.dtoOut.uuAppErrorMap) || {};

      const isDup =
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE] &&
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE].cause &&
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE].cause[TerritoryConstants.NOT_UNIQUE_ID_CODE];

      if (isDup) {
        DtoBuilder.addWarning(new Warnings.Init.UuAwscAlreadyCreated());
        awsc = await UuTerrClient.Awsc.get(
          { code: `${ShoplistMainConstants.AWSC_PREFIX}/${this.uuShoplist.awid}` },
          appClientOpts,
        );
      } else {
        DtoBuilder.addUuAppErrorMap(awscCreateErrorMap);
        throw new Errors.CreateAwscFailed(
          { uuTerritoryBaseUri: this.uuShoplist.uuTerritoryBaseUri, awid: this.uuShoplist.awid },
          e,
        );
      }
    }

    this.uuShoplist = await this.dao.updateByAwid({
      awid: this.uuShoplist.awid,
      artifactId: awsc.id,
    });

    return this.uuShoplist;
  }

  async loadAwsc() {
    const appClientOpts = this.getAppClientOpts();

    let awsc;
    try {
      awsc = await UuTerrClient.Awsc.load({ id: this.uuShoplist.artifactId }, appClientOpts);
    } catch (e) {
      throw new Errors.LoadAwscFailed({ artifactId: this.uuShoplist.artifactId }, e);
    }

    return awsc;
  }

  async setAwscState(state) {
    const appClientOpts = this.getAppClientOpts();
    try {
      await UuTerrClient.Awsc.setState(
        {
          id: this.uuShoplist.artifactId,
          state,
        },
        appClientOpts,
      );
    } catch (e) {
      throw new Errors.SetAwscStateFailed({ state, id: this.uuShoplist.artifactId }, e);
    }
  }

  async deleteAwsc() {
    const appClientOpts = this.getAppClientOpts();
    try {
      await UuTerrClient.Awsc.delete({ id: this.uuShoplist.artifactId }, appClientOpts);
    } catch (e) {
      if (e.cause?.code !== TerritoryConstants.ARTIFACT_DOES_NOT_EXIST) {
        throw new Errors.DeleteAwscFailed({ id: this.uuShoplist.artifactId }, e);
      }
    }
  }

  getAppClientOpts() {
    return { baseUri: this.territoryUri, session: this.session, appUri: this.uri };
  }
}

module.exports = ShoplistMainClient;
