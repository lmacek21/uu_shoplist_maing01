//@@viewOn:imports
import { createComponent, useDataList } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const shoplistDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        create: handleCreate,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
      }
    });

    function handleLoad(dtoIn) {
      return Calls.Shoplist.list(dtoIn);
    }

    function handleCreate(values) {
      return Calls.Shoplist.create(values);
    }

    function handleUpdate(values) {
      return Calls.Shoplist.update(values);
    }

    function handleDelete(shopList) {
      const dtoIn = { id: shopList.id };
      return Calls.Shoplist.delete(dtoIn, props.baseUri);
    }
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(shoplistDataList) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports