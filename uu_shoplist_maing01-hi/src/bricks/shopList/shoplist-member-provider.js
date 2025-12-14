//@@viewOn:imports
import { createComponent, useDataObject, PropTypes } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

const ShoplistMemberProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ShoplistMemberProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    id: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const shoplistDataObject = useDataObject({
      handlerMap: {
        load: handleLoad,
        update: handleUpdate
      },
    });

    function handleLoad(dtoIn) {
      dtoIn = {}
      dtoIn.id = props.id
      return Calls.Shoplist.get(dtoIn);
    }

    function handleUpdate(dtoIn) {
      return Calls.Shoplist.update(dtoIn);
    }

    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(shoplistDataObject) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ShoplistMemberProvider };
export default ShoplistMemberProvider;
//@@viewOff:exports