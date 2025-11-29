// import { Environment } from "uu5g05";
// import Plus4U5 from "uu_plus4u5g02";

// // NOTE During frontend development it's possible to redirect uuApp command calls elsewhere, e.g. to production/staging
// // backend, by configuring it in *-hi/env/development.json:
// //   "uu5Environment": {
// //     "callsBaseUri": "https://uuapp-dev.plus4u.net/vnd-app/awid"
// //   }

// const Calls = {
//   call(method, url, dtoIn, clientOptions) {
//     return Plus4U5.Utils.AppClient[method](url, dtoIn, clientOptions);
//   },

//   // // example for mock calls
//   // loadDemoContent(dtoIn) {
//   //   const commandUri = Calls.getCommandUri("loadDemoContent");
//   //   return Calls.call("cmdGet", commandUri, dtoIn);
//   // },

//   loadIdentityProfiles() {
//     const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
//     return Calls.call("cmdGet", commandUri);
//   },

//   initWorkspace(dtoInData) {
//     const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
//     return Calls.call("cmdPost", commandUri, dtoInData);
//   },

//   getWorkspace() {
//     const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
//     return Calls.call("cmdGet", commandUri);
//   },

//   async initAndGetWorkspace(dtoInData) {
//     await Calls.initWorkspace(dtoInData);
//     return await Calls.getWorkspace();
//   },

//   getCommandUri(useCase, baseUri = Environment.appBaseUri) {
//     return (!baseUri.endsWith("/") ? baseUri + "/" : baseUri) + (useCase.startsWith("/") ? useCase.slice(1) : useCase);
//   },
// };

// export default Calls;

import { Environment } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";

const CALLS_BASE_URI = (
  (process.env.NODE_ENV !== "production" ? Environment.get("callsBaseUri") : null) || Environment.appBaseUri
).replace(/\/*$/, "/");

const Calls = {
  async call(method, url, dtoIn, clientOptions) {
    const response = await Plus4U5.Utils.AppClient[method](url, dtoIn, clientOptions);
    return response.data;
  },

  loadIdentityProfiles() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
    return Calls.call("get", commandUri, {});
  },

  initWorkspace(dtoInData) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
    return Calls.call("post", commandUri, dtoInData);
  },

  getWorkspace() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
    return Calls.call("get", commandUri, {});
  },

  async initAndGetWorkspace(dtoInData) {
    await Calls.initWorkspace(dtoInData);
    return await Calls.getWorkspace();
  },

  Shoplist: {
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("shoplist/list");
      return Calls.call("get", commandUri, dtoIn);
    },

    create(dtoIn) {
      const commandUri = Calls.getCommandUri("shoplist/create");
      return Calls.call("post", commandUri, dtoIn);
    },

    update(dtoIn) {
      const commandUri = Calls.getCommandUri("shoplist/update");
      return Calls.call("post", commandUri, dtoIn);
    },

    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("shoplist/delete");
      return Calls.call("post", commandUri, dtoIn);
    },
  },

  Item: {
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("item/list");
      return Calls.call("get", commandUri, dtoIn);
    },

    create(dtoIn) {
      const commandUri = Calls.getCommandUri("item/create");
      return Calls.call("post", commandUri, dtoIn);
    },

    update(dtoIn) {
      const commandUri = Calls.getCommandUri("item/update");
      return Calls.call("post", commandUri, dtoIn);
    },

    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("item/delete");
      return Calls.call("post", commandUri, dtoIn);
    },
  },

  Shoplists:{
    load(dtoIn) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/load");
    return Calls.call("get", commandUri, dtoIn);
    },
  },

  getCommandUri(useCase) {
    return CALLS_BASE_URI + useCase.replace(/^\/+/, "");
  },
};

export default Calls;
