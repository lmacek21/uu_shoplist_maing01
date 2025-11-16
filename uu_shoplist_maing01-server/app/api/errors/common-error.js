"use strict";
const ShoplistMainUseCaseError = require("./shoplist-main-use-case-error.js");

class InvalidDtoIn extends ShoplistMainUseCaseError {
  constructor(dtoOut, paramMap = {}, cause = null) {
    super("invalidDtoIn", "DtoIn is not valid.", paramMap, cause, undefined, dtoOut);
  }
}

module.exports = {
  InvalidDtoIn,
};
