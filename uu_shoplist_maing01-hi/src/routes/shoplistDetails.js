//@@viewOn:imports
import { createVisualComponent, useSession } from "uu5g05";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import { withRoute } from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import { RouteController } from "uu_plus4u5g02-app";
import ItemListProvider from "../bricks/items/item-list-provider.js";
import ItemListView from "../bricks/items/item-list-view.js";
import ItemCreateView from "../bricks/items/create-view.js";
import MemberListProvider from "../bricks/member/member-list-provider.js";
import MemberListView from "../bricks/member/member-list-view.js";
import MemberCreateView from "../bricks/member/create-view.js";

//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: () => Config.Css.css({ maxWidth: 640, margin: "0px auto" }),
  createView: () => Config.Css.css({ margin: "24px 0px" }),
};
//@@viewOff:css

let ShoplistDetails = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Items",
  //@@viewOff:statics

 render(props) {
    //@@viewOn:private
    const id = props.params.id

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
        <ItemListProvider id={id}>
          {(itemDataList) => (
            <RouteController routeDataObject={itemDataList}>
              <div className={Css.container()}>
                {/* {canCreate && (
                  <ItemCreateView
                    itemDataList={itemDataList}
                    userList={subAppDataObject.data.userList}
                    className={Css.createView()}
                    identity={identity}
                  />
                )} */}
                <ItemListView 
                    itemDataList={itemDataList} 
                    userList={subAppDataObject.data.userList}
                    profileList={profileList}
                    identity={identity}
                />
              </div>
            </RouteController>
          )}
        </ItemListProvider>
        {/* <MemberListProvider>
          {(itemDataList) => (
            <RouteController routeDataObject={[itemDataList]}>
              <div className={Css.container()}>
                {canCreate && (
                  <MemberCreateView
                    shoplistDataList={shoplistDataList}
                    userList={subAppDataObject.data.userList}
                    className={Css.createView()}
                    identity={identity}
                  />
                )}
                <MemberListView 
                    shoplistDataList={shoplistDataList} 
                    userList={subAppDataObject.data.userList}
                    profileList={profileList}
                    identity={identity}
                />
              </div>
            </RouteController>
          )}
        </MemberListProvider> */}
        {/* <div style={{ display: "flex" }}>
         <ItemListProvider>
          {({ itemList, remove, update, create }) => (
            <div style={{ flex: 1, flexDirection: "column" }}>
              <ItemListView itemList={itemList} onDelete={remove} onUpdate={update} />
              <ItemCreateView onCreate={create} style={{ maxWidth: 400, margin: "20px auto", display: "block" }} />
              <ListTitle itemList={itemList} />
            </div>
          )}
        </ItemListProvider>
        <MemberListProvider>
          {({ memberList, remove, create }) => (
            <div style={{ flex: 1, flexDirection: "column" }}>
              <MemberListView memberList={memberList} onDelete={remove}/>
              <MemberCreateView onCreate={create} style={{ maxWidth: 400, margin: "20px auto", display: "block" }} />
            </div>
          )}
        </MemberListProvider>
        </div> */}
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