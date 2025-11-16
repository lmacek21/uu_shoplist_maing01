"use strict";
const ShoplistMainUseCaseWarning = require("./shoplist-main-use-case-warning.js");

const Warnings = {
  Init: {
    UuAwscAlreadyCreated: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap) {
        super("uuAwscAlreadyCreated", "Step uuAwscCreated skipped, uuAwsc already exists.", paramMap);
      }
    },

    ProgressSetStateCallFailed: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressSetStateCallFailed", "Failed to call progress/setState uuCommand.", paramMap);
      }
    },
  },

  _initFinalize: {
    ConsoleDoesNotExist: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap) {
        super("consoleDoesNotExist", "Console does not exist.", paramMap);
      }
    },
  },

  _initFinalizeRollback: {
    ConsoleDoesNotExist: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap) {
        super("consoleDoesNotExist", "Console does not exist.", paramMap);
      }
    },

    UuAwscDoesNotExist: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap) {
        super("uuAwscDoesNotExist", "uuAwsc does not exist.", paramMap);
      }
    },

    ProgressDoesNotExist: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap) {
        super("progressDoesNotExist", "Progress does not exist.", paramMap);
      }
    },

    ProgressEndCallFailed: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressEndCallFailed", "Failed to call progress/end uuCommand.", paramMap);
      }
    },

    ProgressSetStateCallFailed: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressSetStateCallFailed", "Failed to call progress/setState uuCommand.", paramMap);
      }
    },

    ProgressDeleteCallFailed: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressDeleteCallFailed", "Failed to call progress/delete uuCommand.", paramMap);
      }
    },
  },

  SetStateClosed: {
    ProgressSetStateCallFailed: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressSetStateCallFailed", "Failed to call progress/setState uuCommand.", paramMap);
      }
    },
  },

  _setStateClosedFinalize: {
    AwscAlreadyInFinalState: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("awscAlreadyInFinalState", "Awsc is already in final state.", paramMap);
      }
    },
  },

  _clearFinalize: {
    FailedToDeleteProgress: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("failedToDeleteProgress", "Failed to delete progress.", paramMap);
      }
    },

    FailedToClearConsole: class extends ShoplistMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("failedToClearConsole", "Failed to clear console.", paramMap);
      }
    },
  },
};

module.exports = Warnings;
