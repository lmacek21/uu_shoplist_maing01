//@@viewOn:imports
import { createVisualComponent, Utils, Environment } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import Home from "../routes/home.js";

const ShoplistDetails = Utils.Component.lazy(() => import("../routes/shoplistDetails.js"));
const Shoplists = Utils.Component.lazy(() => import("../routes/shoplists.js"));
const InitAppWorkspace = Utils.Component.lazy(() => import("../routes/init-app-workspace.js"));
const ControlPanel = Utils.Component.lazy(() => import("../routes/control-panel.js"));
//@@viewOff:imports

//@@viewOn:constants
const ROUTE_MAP = {
  "": { redirect: "home" },
  home: (props) => <Home {...props} />,
  shoplistDetails: (props) => <ShoplistDetails {...props} />,
  shoplists: (props) => <Shoplists {...props} />,
  "sys/uuAppWorkspace/initUve": (props) => <InitAppWorkspace {...props} />,
  controlPanel: (props) => <ControlPanel {...props} />,
  "*": { redirect: "home" },
};
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const Spa = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Spa",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider initialLanguageList={["en", "cs"]} baseUri={Environment.get("callsBaseUri")}>
        <Plus4U5App.Spa routeMap={ROUTE_MAP} />
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Spa };
export default Spa;
//@@viewOff:exports
