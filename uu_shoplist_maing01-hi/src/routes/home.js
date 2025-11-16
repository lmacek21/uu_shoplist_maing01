//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import ItemListProvider from "../bricks/shopList/item-list-provider.js";
import ItemListView from "../bricks/shopList/item-list-view.js";
//@@viewOff:imports

let Home = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Home",
  //@@viewOff:statics

 render() {
    //@@viewOn:render
    return (
      <>
        <RouteBar />
         <ItemListProvider>
          {({ itemList, remove, update }) => <ItemListView itemList={itemList} onDelete={remove} onUpdate={update} />}
        </ItemListProvider>
      </>
    );
    //@@viewOff:render
  },
});

Home = withRoute(Home, { authenticated: true });

//@@viewOn:exports
export { Home };
export default Home;
//@@viewOff:exports
