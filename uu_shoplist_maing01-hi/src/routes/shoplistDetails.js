//@@viewOn:imports
import { createVisualComponent, useSession, useLsi } from "uu5g05";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import { Text } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi";

import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import { RouteController } from "uu_plus4u5g02-app";
import ItemListProvider from "../bricks/items/item-list-provider.js";
import ShoplistMemberProvider from "../bricks/shoplist/shoplist-member-provider.js";
import ShoplistMemberView from "../bricks/shoplist/shoplist-member-view.js";
import AddMemberView from "../bricks/shoplist/add-member-view.js";
import ItemListView from "../bricks/items/item-list-view.js";
import ItemChartView from "../bricks/items/item-chart-view.js";
import ItemCreateView from "../bricks/items/create-view.js";

//@@viewOff:imports

//@@viewOn:css
const Css = {
  // layout: () => Config.Css.css({ maxWidth: 1280, margin: "0px auto 20px", display: "flex" }),
  // container: () => Config.Css.css({ maxWidth: 960, margin: "0px 30px 20px", flex: 1, display: "flex" }),
  // itemcontainer: () => Config.Css.css({ maxWidth: 640, margin: "0px 30px 20px", flex: 1 }),
  // chartcontainer: () => Config.Css.css({ maxWidth: 320, margin: "0px 30px 20px", flex: 1 }),
  // memberContainer: () => Config.Css.css({ maxWidth: 320, margin: "0px 30px 20px", flex: 1 }),
  // heading: () => Config.Css.css({ margin: "20px", marginRight: "150px", alignItems: "center"}),
  // memberheading: () => Config.Css.css({ margin: "20px", alignItems: "center"}),
  // chartheading: () => Config.Css.css({ margin: "20px", display: "flex", alignItems: "center", justifyContent: "center"}),
  // createView: () => Config.Css.css({ margin: "24px", marginLeft: "auto", flexGrow: 1}),
  // btnmenu: () => Config.Css.css({ maxWidth: 640, margin: "0px auto", display: "flex", alignItems: "center" }),
  // memberbtnmenu: () => Config.Css.css({ maxWidth: 320, margin: "0px auto", display: "flex", alignItems: "center" }),
  // memberText: () => Config.Css.css({ maxWidth: 640, margin: "0px auto", display: "flex", alignItems: "center", justifyContent: "center" }),
  layout: () => Config.Css.css({ maxWidth: 1280, margin: "0px auto 20px", display: "flex", flexWrap: "wrap" }),
  itemcontainer: () => Config.Css.css({  margin: "0px 30px 20px", flex: 1 }),
  chartcontainer: () => Config.Css.css({  maxWidth: 520,margin: "0px 30px 20px", flex: 1 }),
  memberContainer: () => Config.Css.css({  maxWidth: 640, margin: "0px 30px 20px", flex: "1 1 100%" }),
  heading: () => Config.Css.css({ margin: "20px", marginRight: "150px", alignItems: "center"}),
  memberheading: () => Config.Css.css({ margin: "20px", alignItems: "center"}),
  chartheading: () => Config.Css.css({ margin: "20px", display: "flex", alignItems: "center", justifyContent: "center"}),
  createView: () => Config.Css.css({ margin: "24px", marginLeft: "auto", flexGrow: 1}),
  btnmenu: () => Config.Css.css({ maxWidth: 640, margin: "0px auto", display: "flex", alignItems: "center" }),
  memberbtnmenu: () => Config.Css.css({ maxWidth: 320, margin: "0px auto", display: "flex", alignItems: "center" }),
  memberText: () => Config.Css.css({ maxWidth: 640, margin: "0px auto", display: "flex", alignItems: "center", justifyContent: "center" }),
};
//@@viewOff:css

let ShoplistDetails = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ShoplistDetails",
  //@@viewOff:statics

 render(props) {
    //@@viewOn:private
    const id = props.params.id
    const ownerId = props.params.ownerId
    const member = props.params.member
    console.log(member)

    const subAppDataObject = useSubAppData();
    const systemDataObject = useSystemData();
    const { identity } = useSession();
    
    const profileList = systemDataObject.data.profileData.uuIdentityProfileList;
    const canModify = profileList.includes("Authorities") || (profileList.includes("Executives") && (ownerId === identity.uuIdentity));
    
    const lsi = useLsi(importLsi, [ShoplistDetails.uu5Tag]);
    
    //@@viewOff:private
    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <div className={Css.layout()}>
        <ItemListProvider id={id} ownerId={ownerId}>
          {(itemDataList) => (
            <RouteController routeDataObject={itemDataList}>
              {/* <div className={Css.container()}> */}
                <div className={Css.itemcontainer()}>
                <div className={Css.btnmenu()}>
                <Text category="interface" segment="title" type="major" significance="common" colorScheme="building" className={Css.heading()}>
                           {lsi.items}
                        </Text>
                {canModify && (
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
                    member={member}
                />
                </div>
                <div className={Css.chartcontainer()}>
                <Text category="interface" segment="title" type="major" significance="common" colorScheme="building" className={Css.chartheading()}>
                           {lsi.chart}
                        </Text>
                <ItemChartView 
                    itemDataList={itemDataList} 
                />
                </div>
              {/* </div> */}
            </RouteController>
          )}
        </ItemListProvider>
        <ShoplistMemberProvider id={id}>
          {(shoplistDataObject) => (
            <RouteController routeDataObject={shoplistDataObject}>
              <div className={Css.memberContainer()}>
                <div className={Css.btnmenu()}>
                <Text category="interface" segment="title" type="major" significance="common" colorScheme="building" className={Css.memberheading()}>
                           {lsi.members}
                        </Text>
                {canModify && (
                  <AddMemberView
                    shoplistDataObject={shoplistDataObject}
                    userList={subAppDataObject.data.userList}
                    className={Css.createView()}
                    identity={identity}
                  />
                )}
                </div>
                <ShoplistMemberView 
                    shoplistDataObject={shoplistDataObject} 
                    profileList={profileList}
                    identity={identity}
                    ownerId={ownerId}
                />
              </div>
            </RouteController>
          )}
        </ShoplistMemberProvider>
         </div>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ShoplistDetails };
export default ShoplistDetails;
//@@viewOff:exports