const AppClient = require("uu_appg01_server").AppClient;
const { UseCaseError } = require("uu_appg01_server").AppServer;

const { session, dtoOut } = scriptContext;

/*@@viewOn:names*/
const Names = {
  SCRIPT_LIB_NAME: "uu_shoplist_maing01-uuscriptlib",
  CLASS_NAME: "ShoplistMainClient",
};
/*@@viewOff:names*/

/*@@viewOn:errors*/
const Errors = {
  ERROR_PREFIX: `${Names.SCRIPT_LIB_NAME}/${Names.CLASS_NAME}/`,

  LoadUuShoplistFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/load failed.";
      this.code = `${Errors.ERROR_PREFIX}loadUuShoplistFailed`;
    }
  },

  GetUuShoplistFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/get failed.";
      this.code = `${Errors.ERROR_PREFIX}getUuShoplistFailed`;
    }
  },

  InitFinalizeFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/_initFinalize failed.";
      this.code = `${Errors.ERROR_PREFIX}initFinalizeFailed`;
    }
  },

  InitFinalizeRollbackFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/_initFinalizeRollback failed.";
      this.code = `${Errors.ERROR_PREFIX}initFinalizeRollbackFailed`;
    }
  },

  SetStateClosedFinalizeFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/_setStateClosedFinalize failed.";
      this.code = `${Errors.ERROR_PREFIX}setStateClosedFinalizeFailed`;
    }
  },

  ClearFinalizeFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/_clearFinalize failed.";
      this.code = `${Errors.ERROR_PREFIX}clearFinalizeFailed`;
    }
  },
};

/*@@viewOff:errors*/

class ShoplistMainClient {
  constructor(baseUri) {
    this.appClient = new AppClient({ baseUri, session });
    // base uri can be used as parameter in error
    this.baseUri = baseUri;
  }

  async load() {
    let shoplist;
    try {
      shoplist = await this.appClient.cmdGet("sys/uuAppWorkspace/load");
    } catch (e) {
      throw new Errors.LoadUuShoplistFailed({ baseUri: this.baseUri }, e);
    }
    return shoplist;
  }

  async get() {
    let shoplist;
    try {
      shoplist = await this.appClient.cmdGet("sys/uuAppWorkspace/get");
    } catch (e) {
      throw new Errors.GetUuShoplistFailed({ baseUri: this.baseUri }, e);
    }
    return shoplist;
  }

  async initFinalize(lockSecret) {
    let shoplist;
    try {
      shoplist = await this.appClient.cmdPost("sys/uuAppWorkspace/_initFinalize", { lockSecret });
    } catch (e) {
      throw new Errors.InitFinalizeFailed({ baseUri: this.baseUri }, e);
    }
    return shoplist;
  }

  async initFinalizeRollback(lockSecret) {
    let shoplist;
    try {
      shoplist = await this.appClient.cmdPost("sys/uuAppWorkspace/_initFinalizeRollback", { lockSecret });
    } catch (e) {
      throw new Errors.InitFinalizeRollbackFailed({ baseUri: this.baseUri }, e);
    }
    return shoplist;
  }

  async setStateClosedFinalize(lockSecret) {
    let shoplist;
    try {
      shoplist = await this.appClient.cmdPost("sys/uuAppWorkspace/_setStateClosedFinalize", { lockSecret });
    } catch (e) {
      throw new Errors.SetStateClosedFinalizeFailed({ baseUri: this.baseUri }, e);
    }
    return shoplist;
  }

  async clearFinalize(lockSecret) {
    let shoplist;
    try {
      shoplist = await this.appClient.cmdPost("sys/uuAppWorkspace/_clearFinalize", { lockSecret });
    } catch (e) {
      throw new Errors.ClearFinalizeFailed({ baseUri: this.baseUri }, e);
    }
    return shoplist;
  }
}

module.exports = ShoplistMainClient;
