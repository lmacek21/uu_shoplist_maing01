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
      justifyContent: "space-around",
      width: 240,
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
function hasManagePermission(ownerId, identity, profileList) {
  const isAuthority = profileList.includes("Authorities");
  const isExecutive = profileList.includes("Executives");
  console.log(ownerId)
  const isOwner = ownerId === identity.uuIdentity;
  return isAuthority || (isExecutive && isOwner);
}
//@@viewOff:helpers

const ItemTile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ItemTile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    userList: PropTypes.array,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onResolve: PropTypes.func,
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
    const lsi = useLsi(importLsi, [ItemTile.uu5Tag]);
    const itemDataObject = props.data;
    
    function handleDelete() {
        props.onDelete(itemDataObject);
      }
    
    function handleUpdate() {
        props.onUpdate(itemDataObject);
      }

    function handleResolve() {
        props.onResolve(itemDataObject);
      }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props, Css.main());
    const item = itemDataObject.data;
    const canManage = hasManagePermission(props.ownerId, props.identity, props.profileList);
    const isActionDisabled = itemDataObject.state === "pending";
    const isResolved = itemDataObject.data.status === "resolved";

    return (
      <Box { ...elementProps }>
        <div className={Css.header()}>
         {!isResolved && ( <Text category="interface" segment="highlight" type="major" significance="common" colorScheme="building" className={Css.text()}>
            {item.name}
          </Text> )}
          {isResolved && ( <Text category="interface" segment="highlight" type="major" significance="common" colorScheme="light-green" className={Css.text()}>
            {item.name}
          </Text> )}
         {!isResolved && canManage && ( <Button
          icon="mdi-pencil"
          onClick={handleUpdate}
          significance="subdued"
          tooltip={lsi.updateTip}
          disabled={isActionDisabled}
          colorScheme="cyan"
        />)}
        </div>
          {canManage && !isResolved && (
            <div className={Css.buttons()}>
              <Button
                icon="mdi-check-bold"
                onClick={handleResolve}
                significance="distinct"
                tooltip={lsi.updateTip}
                disabled={isActionDisabled}
                colorScheme="dark-green"
              >Resolve</Button>
              <Button
                icon="mdi-delete"
                onClick={handleDelete}
                significance="distinct"
                tooltip={lsi.deleteTip}
                disabled={isActionDisabled}
                colorScheme="negative"
              >Delete</Button>  
          </div>)}
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ItemTile };
export default ItemTile;
//@@viewOff:exports