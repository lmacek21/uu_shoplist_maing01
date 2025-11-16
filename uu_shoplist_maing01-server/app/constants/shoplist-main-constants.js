"use strict";

//@@viewOn:constants
const ShoplistMainConstants = {
  AWSC_PREFIX: "uu-shoplist",
  CONSOLE_PREFIX: "shoplist",
  ERROR_PREFIX: "uu-shoplist-main",
  INIT_PROGRESS_CODE_PREFIX: "uu-shoplist-maing01-progress-init-",
  INIT_PROGRESS_NAME_PREFIX: "uuShoplist Init ",
  SET_STATE_CLOSED_PROGRESS_CODE_PREFIX: "uu-shoplist-maing01-progress-setStateClosed-",
  SET_STATE_CLOSED_PROGRESS_NAME_PREFIX: "uuShoplist Set State Closed ",
  CLEAR_PROGRESS_CODE_PREFIX: "uu-shoplist-maing01-progress-clear-",
  CLEAR_PROGRESS_NAME_PREFIX: "uuShoplist Clear ",
  UUAPP_CODE: "uu-shoplist-maing01",

  CONFIG_CACHE_KEY: "configuration",
  UU_APP_ERROR_MAP: "uuAppErrorMap",

  // This is bound matrix of uuAwsc and uuConsole which has authorization bounded to that uuAwsc.
  CONSOLE_BOUND_MATRIX: {
    Authorities: ["Authorities", "Readers", "Writers"],
    Operatives: ["Readers", "Writers"],
    Auditors: ["Readers"],
    SystemIdentity: ["Authorities", "Readers", "Writers"],
  },

  InitStepMap: {
    SHOPLIST_OBJECT_CREATED: { code: "uuShoplistObjectCreated", message: "The uuObject of uuShoplist created." },
    AWSC_CREATED: { code: "uuAwscCreated", message: "The uuAwsc of uuShoplist created." },
    WS_CONNECTED: { code: "uuAppWorkspaceConnected", message: "The uuShoplist uuAppWorkspace connected." },
    CONSOLE_CREATED: { code: "consoleCreated", message: "The console of uuShoplist created." },
    PROGRESS_ENDED: { code: "progressEnded", message: "The progress has been ended." },
    WS_ACTIVE: { code: "uuAppWorkspaceActiveState", message: "The uuAppWorkspace of uuShoplist set to active state." },
  },

  InitRollbackStepMap: {
    CONSOLE_CLEARED: { code: "consoleCleared", message: "The uuShoplist console has been cleared." },
    WS_DISCONNECTED: { code: "uuAppWorkspaceDisonnected", message: "The uuShoplist uuAppWorkspace disconnected." },
    AWSC_DELETED: { code: "uuAwscDeleted", message: "The uuAwsc of uuShoplist deleted." },
    PROGRESS_DELETED: { code: "progressDeleted", message: "The progress has been deleted." },
  },

  SetStateClosedStepMap: {
    CLOSE_STARTED: { code: "setStateClosedStarted", message: "SetStateClosed has started." },
    AWSC_CLOSED: { code: "uuAwscClosed", message: "The uuObject of uuShoplist set to closed state." },
    PROGRESS_ENDED: { code: "progressEnded", message: "The progress has been ended." },
  },

  ClearStepMap: {
    CLEAR_STARTED: { code: "clearStarted", message: "Clear has started." },
    INIT_PROGRESS_DELETED: { code: "initProgressDeleted", message: "The init progress has been deleted." },
    SET_STATE_CLOSED_PROGRESS_DELETED: {
      code: "setStateClosedProgressDeleted",
      message: "The setStateClosed progress has been deleted.",
    },
    CONSOLE_CLEARED: { code: "consoleCleared", message: "The uuShoplist console has been cleared." },
    AUTH_STRATEGY_UNSET: {
      code: "authorizationStrategyUnset",
      message: "The authorization strategy has been unset.",
    },
    AWSC_DELETED: { code: "uuAwscDeleted", message: "The uuAwsc of uuShoplist deleted." },
    PROGRESS_ENDED: { code: "progressEnded", message: "The progress has been ended." },
  },

  ModeMap: {
    STANDARD: "standard",
    RETRY: "retry",
    ROLLBACK: "rollback",
  },

  ProfileMask: {
    STANDARD_USER: parseInt("00010000000000000000000000000000", 2),
  },

  PropertyMap: {
    CONFIG: "config",
    SCRIPT_CONFIG: "scriptConfig",
    SHOPLIST_CONFIG: "uuShoplistConfig",
  },

  Schemas: {
    SHOPLIST_INSTANCE: "shoplistMain",
  },

  SharedResources: {
    SCRIPT_CONSOLE: "uu-console-maing02",
    SCRIPT_ENGINE: "uu-script-engineg02",
  },

  StateMap: {
    CREATED: "created",
    BEING_INITIALIZED: "beingInitialized",
    ACTIVE: "active",
    FINAL: "closed",
  },

  getMainConsoleCode: (awid) => {
    return `uu-shoplist-maing01-console-${awid}`;
  },

  getInitProgressCode: (awid) => {
    return `${ShoplistMainConstants.INIT_PROGRESS_CODE_PREFIX}${awid}`;
  },

  getInitProgressName: (awid) => {
    return `${ShoplistMainConstants.INIT_PROGRESS_NAME_PREFIX}${awid}`;
  },

  getSetStateClosedProgressName: (awid) => {
    return `${ShoplistMainConstants.SET_STATE_CLOSED_PROGRESS_NAME_PREFIX}${awid}`;
  },

  getSetStateClosedProgressCode: (awid) => {
    return `${ShoplistMainConstants.SET_STATE_CLOSED_PROGRESS_CODE_PREFIX}${awid}`;
  },

  getClearProgressName: (awid) => {
    return `${ShoplistMainConstants.CLEAR_PROGRESS_NAME_PREFIX}${awid}`;
  },

  getClearProgressCode: (awid) => {
    return `${ShoplistMainConstants.CLEAR_PROGRESS_CODE_PREFIX}${awid}`;
  },

  getInitStepCount: () => {
    return Object.keys(ShoplistMainConstants.InitStepMap).length;
  },

  getInitRollbackStepCount: () => {
    return Object.keys(ShoplistMainConstants.InitRollbackStepMap).length;
  },

  getSetStateClosedStepCount: () => {
    return Object.keys(ShoplistMainConstants.SetStateClosedStepMap).length;
  },

  getClearStepCount: () => {
    return Object.keys(ShoplistMainConstants.ClearStepMap).length;
  },
};
//@@viewOff:constants

//@@viewOn:exports
module.exports = ShoplistMainConstants;
//@@viewOff:exports
