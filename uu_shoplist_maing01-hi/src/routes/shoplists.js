//@@viewOn:imports
import { createVisualComponent, useSession, useState, useLsi } from "uu5g05";
import { useSubAppData, useSystemData } from "uu_plus4u5g02";
import { RouteController } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar";
import ListProvider from "../bricks/shoplist/shoplist-list-provider.js";
import ListView from "../bricks/shoplist/shoplist-list-view.js";
import ArchiveListView from "../bricks/shoplist/shoplist-archive-view.js";
import CreateView from "../bricks/shoplist/create-view";
import { Button } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: () => Config.Css.css({ maxWidth: 640, margin: "0px auto 20px" }),
  btnmenu: () => Config.Css.css({ maxWidth: 640, margin: "0px auto", display: "flex" }),
  createView: () => Config.Css.css({ margin: "24px", marginRight: "auto", flexGrow: 1}),
  button: () => Config.Css.css({ margin: "auto 24px", alignItems: "center"}),
  bcbutton: () => Config.Css.css({ margin: "24px", alignItems: "center"}),
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
    const [view, setView] = useState({ archive: false  });

    const lsi = useLsi(importLsi, [Shoplists.uu5Tag]);

    function handleView() {
      view.archive ? setView({archive: false}) : setView({archive: true})
    }
    //@@viewOff:private
    //@@viewOn:render
    return (
      <>
        <RouteBar />
        <ListProvider>
          {(shoplistDataList) => (
            <RouteController routeDataObject={shoplistDataList}>
              <div className={Css.container()}>
                <div className={Css.btnmenu()}>
                {canCreate && !view.archive && (
                  <CreateView
                    shoplistDataList={shoplistDataList}
                    userList={subAppDataObject.data.userList}
                    className={Css.createView()}
                    identity={identity}
                  />
                )}
                {!view.archive && (<Button
                className={Css.button()}
                icon="mdi-archive-check-outline"
                onClick={handleView}
                significance="highlighted"
                tooltip= "Archive"
                colorScheme="steel"
                >{lsi.archive}</Button>)}
                {view.archive && (<Button
                className={Css.bcbutton()}
                icon="mdi-arrow-left"
                onClick={handleView}
                significance="highlighted"
                tooltip= "Archive"
                colorScheme="steel"
                >{lsi.back}</Button>)}
                </div>
                {!view.archive && (
                <ListView 
                    shoplistDataList={shoplistDataList} 
                    userList={subAppDataObject.data.userList}
                    profileList={profileList}
                    identity={identity}
                />)}
                {view.archive && (
                <ArchiveListView 
                    shoplistDataList={shoplistDataList} 
                    userList={subAppDataObject.data.userList}
                    profileList={profileList}
                    identity={identity}
                />)}
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