//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi } from "uu5g05";
import { Box, Text, Button } from "uu5g05-elements";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  main: () =>
    Config.Css.css({
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }),

  header: () =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 48,
      paddingLeft: 24,
      paddingRight: 24,
    }),

  title: () =>
    Config.Css.css({
      textAlign: "center",
      // padding: 16,
      // height: 48,
    }),

  footer: () =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 48,
      paddingLeft: 24,
      paddingRight: 24,
    }),
};
//@@viewOff:css

//@@viewOn:helpers
function hasManagePermission(shoplist, identity, profileList) {
  const isAuthority = profileList.includes("Authorities");
  const isExecutive = profileList.includes("Executives");
  const isOwner = shoplist.uuIdentity === identity.uuIdentity;
  return isAuthority || (isExecutive && isOwner);
}
//@@viewOff:helpers

const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    userList: PropTypes.array,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onDetail: PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    userList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [Tile.uu5Tag]);
    const shoplistDataObject = props.data;

    function handleDelete(event) {
      event.stopPropagation();
      props.onDelete(shoplistDataObject);
    }

    function handleUpdate(event) {
      event.stopPropagation();
      props.onUpdate(shoplistDataObject);
    }

    function handleDetail() {
      props.onDetail(shoplistDataObject);
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props, Css.main());
    const shoplist = shoplistDataObject.data;
    const canManage = hasManagePermission(shoplist, props.identity, props.profileList);
    const isActionDisabled = shoplistDataObject.state === "pending";

    return (
      <Box {...elementProps} onClick={handleDetail}>
        <div className={Css.header()}>
        <Text category="interface" segment="title" type="minor" colorScheme="building" className={Css.title()}>
          {shoplist.name}
        </Text>
        <Button
          icon="mdi-pencil"
          onClick={handleUpdate}
          significance="subdued"
          tooltip={lsi.updateTip}
          disabled={isActionDisabled}
          colorScheme="cyan"
        />
        </div>
        <Box significance="distinct" className={Css.footer()}>
          {canManage && (
            <div>
              <Button
                icon="mdi-archive"
                onClick={handleUpdate}
                significance="distinct"
                tooltip={lsi.updateTip}
                disabled={isActionDisabled}
                colorScheme="alternative-active"
              >{lsi.archiveBtn}</Button> 
            </div>)}
          {canManage && (
            <div>
              <Button
                icon="mdi-delete"
                onClick={handleDelete}
                significance="distinct"
                tooltip={lsi.deleteTip}
                disabled={isActionDisabled}
                colorScheme="negative"
              >{lsi.deleteBtn}</Button> 
            </div>
          )}
        </Box>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Tile };
export default Tile;
//@@viewOff:exports