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
    }),

  buttons: () =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "auto",
      marginRight: "15px"
    }),

  text: () =>
    Config.Css.css({
      display: "flex",
      padding: "10px",
      alignItems: "center"
    }),

  header: () =>
      Config.Css.css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "auto"
      }),
};
//@@viewOff:css

//@@viewOn:helpers
function hasManagePermission(ownerId, identity, profileList, member) {
  const isAuthority = profileList.includes("Authorities");
  const isExecutive = profileList.includes("Executives");
  const isOwner = ownerId === identity.uuIdentity;
  return isAuthority || (isExecutive && isOwner) || (isExecutive && member.uuIdentity === identity.uuIdentity);
}
//@@viewOff:helpers

const ShoplistMemberTile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ShoplistMemberTile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    userList: PropTypes.array,
    onDelete: PropTypes.func,
    ownerId: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    userList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [ShoplistMemberTile.uu5Tag]);
    const member = props.data;
    
    function handleDelete() {
        props.onDelete(member);
      }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props, Css.main());
    const canManage = hasManagePermission(props.ownerId, props.identity, props.profileList, member);

    return (
      <Box { ...elementProps }>
        <div className={Css.header()}>
        <Text category="interface" segment="highlight" type="major" significance="common" colorScheme="building" className={Css.text()}>
            {member.name}
        </Text>
        </div>
          {canManage && (
            <div className={Css.buttons()}>
              <Button
                icon="mdi-delete"
                onClick={handleDelete}
                significance="distinct"
                tooltip={lsi.deleteTip}
                colorScheme="negative"
              >{lsi.delete}</Button>  
          </div>)}
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ShoplistMemberTile };
export default ShoplistMemberTile;
//@@viewOff:exports