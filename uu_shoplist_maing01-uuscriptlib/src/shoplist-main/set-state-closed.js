"use strict";

const { Uri } = require("uu_appg01_server").Uri;

// eslint-disable-next-line no-undef
scriptContext.dtoOut = { uuAppErrorMap: {} };
// eslint-disable-next-line no-undef
let { dtoIn, console, dtoOut, session } = scriptContext;

/*@@viewOn:imports*/
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UseCaseError } = require("uu_appg01_server").AppServer;
const { ProgressClient } = require("uu_consoleg02-uulib");

const ShoplistMainClient = uuScriptRequire("uu_shoplist_maing01-uuscriptlib/shoplist-main-client", {
  scriptRequireCacheEnabled: false,
});
/*@@viewOff:imports*/

/*@@viewOn:names*/
const Names = {
  SCRIP_LIB_NAME: "uu_shoplist_maing01-uuscriptlib",
  SCRIPT_NAME: "ShoplistMainSetStateClosed",
};
/*@@viewOff:names*/

/*@@viewOn:constants*/
const CMD_NAME = "setStateClosed";
/*@@viewOff:constants*/

/*@@viewOn:errors*/
const Errors = {
  ERROR_PREFIX: `${Names.SCRIP_LIB_NAME}/${Names.SCRIPT_NAME}/`,

  InvalidDtoIn: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause = null) {
      if (paramMap instanceof Error) {
        cause = paramMap;
        paramMap = {};
      }
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "DtoIn is not valid.";
      this.code = `${Errors.ERROR_PREFIX}invalidDtoIn`;
    }
  },
};
/*@@viewOff:errors*/

/*@@viewOn:scriptClient*/
class ShoplistMainSetStateClosedClient {
  constructor(lockSecret) {
    this.lockSecret = lockSecret;
    this.progressClient = null;
    this.shoplistMainClient = null;
    this.uuShoplist = null;
  }

  async start() {
    this.shoplistMainClient = new ShoplistMainClient(dtoIn.uuShoplistUri);
    this.uuShoplist = await this.shoplistMainClient.load();
    this.progressClient = await ProgressClient.createInstance(
      this.uuShoplist.data.temporaryData.progressMap.uuConsoleUri,
      {
        code: this.uuShoplist.data.temporaryData.progressMap.progressCode,
        lockSecret: this.lockSecret,
      },
      { session }
    );

    return this.uuShoplist;
  }

  async setStateClosedFinalize() {
    return this.shoplistMainClient.setStateClosedFinalize(this.lockSecret);
  }
}
/*@@viewOff:scriptClient*/

/*@@viewOn:validateDtoIn*/
const DtoInValidationSchema = `const scriptShoplistMainSetStateClosedDtoInType = shape({
  uuShoplistUri: string().isRequired(),
  lockSecret: hexa64Code().isRequired(),
})`;

function validateDtoIn(dtoIn, uuAppErrorMap = {}) {
  let dtoInValidator = new Validator(DtoInValidationSchema, true);
  let validationResult = dtoInValidator.validate("scriptShoplistMainSetStateClosedDtoInType", dtoIn);
  return ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, `${Errors.ERROR_PREFIX}unsupportedKeys`, Errors.InvalidDtoIn);
}
/*@@viewOff:validateDtoIn*/

/*@@viewOn:helpers*/
/*@@viewOff:helpers*/

async function main() {
  await console.info(`Script uuShoplist set state closed started`);
  dtoOut.dtoIn = dtoIn;
  const uuAppErrorMap = dtoOut.uuAppErrorMap;

  // validates dtoIn
  await console.info(`Validating dtoIn schema.`);
  await console.info(JSON.stringify(dtoIn));

  validateDtoIn(dtoIn, uuAppErrorMap);

  // initialization shoplistMain client and variables
  let mainContext = new ShoplistMainSetStateClosedClient(dtoIn.lockSecret);
  let uuShoplist = await mainContext.start();

  await console.log(`<uu5string/><UuConsole.Progress baseUri='${Uri.parse(scriptContext.scriptRuntime.getScriptConsoleUri()).baseUri}' progressCode='${mainContext.progressClient.progress.code}' />`);

  // TODO Add steps your application needs here...

  uuShoplist = await mainContext.setStateClosedFinalize();

  return { data: uuShoplist, uuAppErrorMap };
}

main();
