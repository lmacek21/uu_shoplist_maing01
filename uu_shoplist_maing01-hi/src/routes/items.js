//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import ItemListProvider from "../bricks/shopList/item-list-provider.js";
import ItemListView from "../bricks/shopList/item-list-view.js";
import CreateView from "../bricks/shopList/create-view";
import ListTitle from "../bricks/shopList/list-title.js";
//@@viewOff:imports

let Items = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Items",
  //@@viewOff:statics

 render() {
    //@@viewOn:render
    return (
      <>
        <RouteBar />
         <ItemListProvider>
          {({ itemList, remove, update, create }) => (
            <>
              <CreateView onCreate={create} style={{ maxWidth: 400, margin: "24px auto", display: "block" }} />
              <ItemListView itemList={itemList} onDelete={remove} onUpdate={update} />
              <ListTitle itemList={itemList} />
            </>
          )}
        </ItemListProvider>
      </>
    );
    //@@viewOff:render
  },
});

Items = withRoute(Items, { authenticated: true });

//@@viewOn:exports
export { Items };
export default Items;
//@@viewOff:exports