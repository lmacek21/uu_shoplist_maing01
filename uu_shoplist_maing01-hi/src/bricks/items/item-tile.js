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
      marginLeft: "auto",
    }),

  text: () =>
    Config.Css.css({
      padding: "10px"
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

const ItemTile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ItemTile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    userList: PropTypes.array,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
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
    
    function handleDelete(event) {
        event.stopPropagation();
        props.onDelete(itemDataObject);
      }
    
    function handleUpdate(event) {
        event.stopPropagation();
        props.onUpdate(itemDataObject);
      }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props, Css.main());
        const item = itemDataObject.data;
        const canManage = hasManagePermission(item, props.identity, props.profileList);
        const isActionDisabled = itemDataObject.state === "pending";

    return (
      <Box { ...elementProps }>
          <Text category="interface" segment="highlight" type="medium" significance="common" colorScheme="building" className={Css.text()}>
            {item.name}
          </Text>
          <div className={Css.buttons()}>
          {canManage && (
            <div>
              <Button
                icon="mdi-check-bold"
                onClick={handleUpdate}
                significance="subdued"
                tooltip={lsi.updateTip}
                disabled={isActionDisabled}
                colorScheme="dark-green"
              />
              <Button
                icon="mdi-delete"
                onClick={handleDelete}
                significance="subdued"
                tooltip={lsi.deleteTip}
                disabled={isActionDisabled}
                colorScheme="negative"
              />
            </div>
          )}
          </div>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ItemTile };
export default ItemTile;
//@@viewOff:exports