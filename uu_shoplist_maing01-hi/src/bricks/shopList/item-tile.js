//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils } from "uu5g05";
import { Box, Text, Button } from "uu5g05-elements";
import Config from "./config/config.js";
//@@viewOff:imports

const ItemTile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ItemTile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    item: PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }).isRequired,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onUpdate: () => {},
    onDelete: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    function handleDelete(event) {
      props.onDelete(new Utils.Event(props.item, event));
    }

    function handleUpdate(event) {
      props.onUpdate(new Utils.Event(props.item, event));
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    return (
      <Box { ...elementProps }>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            {props.item.name}
          </Text>
          <Text category="interface" segment="content" type="medium" significance="subdued" colorScheme="building">
            {props.item.status}
          </Text>
          <Button icon="mdi-check" onClick={handleUpdate} significance="subdued" tooltip="Update" />
          <Button icon="mdi-delete" onClick={handleDelete} significance="subdued" tooltip="Delete" />
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ItemTile };
export default ItemTile;
//@@viewOff:exports