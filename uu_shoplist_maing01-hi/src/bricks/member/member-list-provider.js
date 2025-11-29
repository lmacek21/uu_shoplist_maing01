//@@viewOn:imports
import { createComponent, Utils, useState } from "uu5g05";
import Config from "./config/config";
//@@viewOff:imports

let initialMemberList = [
  {
    id:Utils.String.generateId(),
    name:"Lubomir Macek",
  },
  {
    id:Utils.String.generateId(),
    name:"Martin Araon",
  },
  {
    id:Utils.String.generateId(),
    name:"Peter Jonhhae",
  },
]

const MemberListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "MemberListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [memberList, setMemberList] = useState(initialMemberList);

    function remove(member) {
      setMemberList((prevMemberList) => prevMemberList.filter((m) => m.id !== member.id))
    }

    function create(values) {
      const member = {
        ...values,
        id: Utils.String.generateId(),
        uuIdentityName: "Hardcoded User",
        sys: {
          cts: new Date().toISOString(),
        },
      };

      setMemberList((prevMemberList) => [...prevMemberList, member]);
      return member;
    }

    //@@viewOff:private

    //@@viewOn:render
    const value = { memberList, remove, create };
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { MemberListProvider };
export default MemberListProvider;
//@@viewOff:exports