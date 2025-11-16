"use strict";
const ShoplistMainUseCaseError = require("./shoplist-main-use-case-error.js");

class CallScriptEngineFailed extends ShoplistMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("callScriptEngineFailed", "Call scriptEngine failed.", paramMap, cause);
  }
}

module.exports = {
  CallScriptEngineFailed,
};
