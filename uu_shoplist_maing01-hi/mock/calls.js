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
  } else if(url === "shoplist/get") {
    const id = args.at(2).id
    const response = await fetch(mockBaseUri + "shoplist/list.json");
    const list = await response.json();
    const shoplist = list.itemList.filter(item => item.id === id);
    if(!shoplist[0]){
      const response = await fetch(mockUrl);
      const temp = await response.json();
      return {...temp}
    }
    return {...shoplist[0]}
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
