//@@viewOn:imports
import { createVisualComponent, useSession } from "uu5g05";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import { withRoute } from "uu_plus4u5g02-app";
import { Text } from "uu5g05-elements";

import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import { RouteController } from "uu_plus4u5g02-app";
import ItemListProvider from "../bricks/items/item-list-provider.js";
import ItemListView from "../bricks/items/item-list-view.js";
import ItemCreateView from "../bricks/items/create-view.js";

//@@viewOff:imports

//@@viewOn:css
const Css = {
  layout: () => Config.Css.css({ maxWidth: 1280, margin: "0px auto 20px", display: "flex" }),
  container: () => Config.Css.css({ maxWidth: 640, margin: "0px 30px 20px", flex: 1 }),
  heading: () => Config.Css.css({ margin: "20px", marginRight: "150px", alignItems: "center"}),
  createView: () => Config.Css.css({ margin: "24px", marginLeft: "auto", flexGrow: 1}),
  btnmenu: () => Config.Css.css({ maxWidth: 640, margin: "0px auto", display: "flex", alignItems: "center" }),
  memberText: () => Config.Css.css({ maxWidth: 640, margin: "0px auto", display: "flex", alignItems: "center", justifyContent: "center" }),
};
//@@viewOff:css

let ShoplistDetails = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Items",
  //@@viewOff:statics

 render(props) {
    //@@viewOn:private
    const id = props.params.id
    const ownerId = props.params.ownerId

    const subAppDataObject = useSubAppData();
    const systemDataObject = useSystemData();
    const { identity } = useSession();
    
    const profileList = systemDataObject.data.profileData.uuIdentityProfileList;
    const canCreate = profileList.includes("Authorities") || profileList.includes("Executives");  
    
    //@@viewOff:private
    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <div className={Css.layout()}>
        <ItemListProvider id={id} ownerId={ownerId}>
          {(itemDataList) => (
            <RouteController routeDataObject={itemDataList}>
              <div className={Css.container()}>
                <div className={Css.btnmenu()}>
                <Text category="interface" segment="title" type="major" significance="common" colorScheme="building" className={Css.heading()}>
                           Item List
                        </Text>
                {canCreate && (
                  <ItemCreateView
                    itemDataList={itemDataList}
                    className={Css.createView()}
                    identity={identity}
                  />
                )}
                </div>
                <ItemListView 
                    itemDataList={itemDataList} 
                    profileList={profileList}
                    identity={identity}
                    ownerId={ownerId}
                />
              </div>
            </RouteController>
          )}
        </ItemListProvider>
        <Text category="interface" segment="title" type="major" significance="common" colorScheme="building" className={Css.memberText()}>
          Here Will Be Member List
        </Text>
         </div>
      </>
    );
    //@@viewOff:render
  },
});

ShoplistDetails = withRoute(ShoplistDetails, { authenticated: true });

//@@viewOn:exports
export { ShoplistDetails };
export default ShoplistDetails;
//@@viewOff:exports