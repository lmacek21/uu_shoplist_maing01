//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils } from "uu5g05";
import { Box, Text, Button } from "uu5g05-elements";
import Config from "./config/config.js";
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
  
  // I can apply css based on available object (image)
  // content: (image) =>
  //   Config.Css.css({
  //     display: "flex",
  //     alignItems: image ? "center" : "left",
  //     justifyContent: image ? "center" : "flex-start",
  //     height: "calc(100% - 48px - 48px)",
  //     overflow: "hidden",
  //   }),
};
//@@viewOff:css

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
    const { elementProps } = Utils.VisualComponent.splitProps(props, Css.main());

    return (
      <Box { ...elementProps }>
          <Text category="interface" segment="highlight" type="medium" significance="common" colorScheme="building" className={Css.text()}>
            {props.item.name}
          </Text>
          <div className={Css.buttons()}>
          <Button icon="mdi-pencil" onClick={handleUpdate} significance="subdued" tooltip="Update" colorScheme="dark-green" />
          <Button icon="mdi-delete" onClick={handleDelete} significance="subdued" tooltip="Delete" colorScheme="negative" />
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