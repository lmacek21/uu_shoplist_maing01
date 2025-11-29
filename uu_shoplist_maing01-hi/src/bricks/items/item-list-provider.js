//@@viewOn:imports
import { createComponent, useDataList, useEffect, useRef, PropTypes } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

const ItemListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ItemListProvider",
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
    const itemDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        create: handleCreate,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
      },
      pageSize: 50,
    });

    function handleLoad(dtoIn) {
      dtoIn.shoplistId = props.id
      return Calls.Item.list(dtoIn);
    }

    function handleCreate(values) {
      return Calls.Item.create(values);
    }

    function handleUpdate(values) {
      return Calls.Item.update(values);
    }

    function handleDelete(item) {
      const dtoIn = { id: item.id };
      return Calls.Item.delete(dtoIn, props.baseUri);
    }

    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(itemDataList) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ItemListProvider };
export default ItemListProvider;
//@@viewOff:exports