//@@viewOn:imports
import { createVisualComponent, useSession } from "uu5g05";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import { RouteController } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import ListProvider from "../bricks/shoplist/shoplist-list-provider.js";
import ListView from "../bricks/shoplist/shoplist-list-view.js";
import CreateView from "../bricks/shoplist/create-view";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: () => Config.Css.css({ maxWidth: 640, margin: "0px auto" }),
  createView: () => Config.Css.css({ margin: "24px 0px" }),
};
//@@viewOff:css

let Shoplists = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Shoplists",
  //@@viewOff:statics

  render() {
    //@@viewOn:private
    const subAppDataObject = useSubAppData();
    const systemDataObject = useSystemData();
    const { identity } = useSession();

    const profileList = systemDataObject.data.profileData.uuIdentityProfileList;
    const canCreate = profileList.includes("Authorities") || profileList.includes("Executives");
    const archive = false;
    //@@viewOff:private
    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <ListProvider>
          {(shoplistDataList) => (
            <RouteController routeDataObject={shoplistDataList}>
              <div className={Css.container()}>
                {canCreate && (
                  <CreateView
                    shoplistDataList={shoplistDataList}
                    userList={subAppDataObject.data.userList}
                    className={Css.createView()}
                    identity={identity}
                  />
                )}
                <ListView 
                    shoplistDataList={shoplistDataList} 
                    userList={subAppDataObject.data.userList}
                    profileList={profileList}
                    identity={identity}
                />
              </div>
            </RouteController>
          )}
        </ListProvider>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Shoplists };
export default Shoplists
//@@viewOff:exports