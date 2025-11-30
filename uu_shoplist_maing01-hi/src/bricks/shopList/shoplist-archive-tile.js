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
  
  slot: () =>
    Config.Css.css({
    marginLeft: "auto"
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

const ArchiveTile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ArchiveTile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    userList: PropTypes.array,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onArchive: PropTypes.func,
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
    const lsi = useLsi(importLsi, [ArchiveTile.uu5Tag]);
    const shoplistDataObject = props.data;

    function handleDelete(event) {
      event.stopPropagation();
      props.onDelete(shoplistDataObject);
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
        {canManage && (
            <div className={Css.slot()}>
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
        </div>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ArchiveTile };
export default ArchiveTile;
//@@viewOff:exports