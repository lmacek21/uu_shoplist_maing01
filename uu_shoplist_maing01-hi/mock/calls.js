// import Calls from "../src/calls.js";

// let appAssetsBaseUri =
//   document.baseURI ||
//   (document.querySelector("base") || {}).href ||
//   location.protocol + "//" + location.host + location.pathname;
// if (!appAssetsBaseUri.endsWith("/")) {
//   appAssetsBaseUri = appAssetsBaseUri.slice(0, appAssetsBaseUri.lastIndexOf("/")); // strip what's after last slash
// }

// Calls.call = (method, url, dtoIn) => {
//   let mockUrl = (process.env.MOCK_DATA_BASE_URI || appAssetsBaseUri) + "mock/data/" + url + ".json";
//   let responsePromise = (async () => {
//     let response = await fetch(mockUrl);
//     return await response.json();
//   })();
//   return dtoIn != null ? responsePromise.then(dtoIn.done, dtoIn.fail) : responsePromise;
// };

// Calls.getCommandUri = (useCase) => {
//   return useCase;
// };

// export default Calls;

import { Client } from "uu_appg01";
import Calls from "../src/calls.js";

const appAssetsBaseUri = (
  document.baseURI ||
  (document.querySelector("base") || {}).href ||
  location.protocol + "//" + location.host + location.pathname
).replace(/^(.*)\/.*$/, "$1/"); // strip what's after last slash

const mockBaseUri = (process.env.MOCK_DATA_BASE_URI || appAssetsBaseUri) + "mock/data/";
const originalGet = Client.get;

Client.get = async (url, dtoIn, clientOpts) => {
  if (url.includes("sys/uuAppWorkspace/load")) {
    const mockUrl = mockBaseUri + "sys/uuAppWorkspace/load.json";
    const response = await fetch(mockUrl);
    return { ...response, data: await response.json() };
  } else {
    return originalGet(url, dtoIn, clientOpts);
  }
};

Calls.call = async (...args) => {
  const url = args.at(1);
  const mockUrl = mockBaseUri + url + ".json";
  if (url === "shoplist/create") {
    const dtoIn = args.at(2)
    const response = await fetch(mockUrl);
    const temp = await response.json();
    return {...temp, ...dtoIn}
  } else if(url === "item/list") {
    const id = args.at(2).shoplistId
    const response = await fetch(mockUrl);
    const temp = await response.json();
    temp.itemList = temp.itemList.filter(item => item.shoplistId === id);
    return temp
  } else if(url === "item/create") {
    const dtoIn = args.at(2)
    const response = await fetch(mockUrl);
    const temp = await response.json();
    return {...temp, ...dtoIn}
  }else if(url === "shoplist/update") {
    const dtoIn = args.at(2)
    const response = await fetch(mockUrl);
    const temp = await response.json();
    return {...temp, ...dtoIn}
  } else if(url === "item/update") {
    const dtoIn = args.at(2)
    const response = await fetch(mockUrl);
    const temp = await response.json();
    return {...temp, ...dtoIn}
  } else {
    const response = await fetch(mockUrl);
    return await response.json();
  }
};

Calls.getCommandUri = (useCase) => {
  return useCase;
};

export default Calls;
