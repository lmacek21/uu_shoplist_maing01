//@@viewOn:imports
import { createComponent, Utils } from "uu5g05";
import Config from "./config/config";
//@@viewOff:imports

let itemList = [
  {
    id:Utils.String.generateId(),
    name:"Chicken",
    status:"Unresolved"
  },
  {
    id:Utils.String.generateId(),
    name:"Banana",
    status:"Unresolved"
  },
  {
    id:Utils.String.generateId(),
    name:"Apple",
    status:"Unresolved"
  },
]

const ItemListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ItemListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    function remove(item) {
      itemList = itemList.filter((i) => i.id !== item.id);
    }

    function update() {
      throw new Error("Item update is not implemented yet.");
    }
    //@@viewOff:private

    //@@viewOn:render
    const value = { itemList, remove, update };
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ItemListProvider };
export default ItemListProvider;
//@@viewOff:exports