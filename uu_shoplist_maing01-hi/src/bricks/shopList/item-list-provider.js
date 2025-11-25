//@@viewOn:imports
import { createComponent, Utils, useState } from "uu5g05";
import Config from "./config/config";
//@@viewOff:imports

let initialItemList = [
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
    const [itemList, setItemList] = useState(initialItemList);

    function remove(item) {
      setItemList((prevItemList) => prevItemList.filter((i) => i.id !== item.id))
    }

    function create(values) {
      const item = {
        ...values,
        id: Utils.String.generateId(),
        uuIdentityName: "Hardcoded User",
        sys: {
          cts: new Date().toISOString(),
        },
      };

      setItemList((prevItemList) => [...prevItemList, item]);
      return item;
    }

    function update() {
      throw new Error("Item update is not implemented yet.");
    }
    //@@viewOff:private

    //@@viewOn:render
    const value = { itemList, remove, update, create };
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ItemListProvider };
export default ItemListProvider;
//@@viewOff:exports