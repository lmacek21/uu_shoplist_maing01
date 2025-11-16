"use strict";
const ShoplistMainUseCaseError = require("../errors/shoplist-main-use-case-error.js");

class ShoplistMainUseCaseWarning {
  constructor(code, message, paramMap) {
    this.code = ShoplistMainUseCaseError.generateCode(code);
    this.message = message;
    this.paramMap = paramMap instanceof Error ? undefined : paramMap;
  }
}

module.exports = ShoplistMainUseCaseWarning;
