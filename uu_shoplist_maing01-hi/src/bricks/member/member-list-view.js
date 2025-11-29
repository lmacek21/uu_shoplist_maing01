//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, Lsi } from "uu5g05";
import { useAlertBus, Text } from "uu5g05-elements";
import MemberTile from "./member-tile";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

const MemberListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "MemberListView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    memberList: PropTypes.array.isRequired,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    memberList: [],
    onDelete: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    function handleDelete(event) {
      const member = event.data;

      try {
        props.onDelete(member);
        addAlert({
          message: `The member ${member.name} has been deleted.`,
          priority: "success",
          durationMs: 2000,
        });
      } catch (error) {
        ListView.logger.error("Error deleting member", error);
        showError(error, "Member delete failed!");
      }
    }

    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    return (
      <div {...attrs}>
        <Text category="interface" segment="title" type="major" significance="common" colorScheme="building" style={{ display:"block", width:"100%", textAlign: "center" }}>
            <Lsi import={importLsi} path={["Details", "memberList"]} />
        </Text>
        {props.memberList.map((member) => (
          <MemberTile
            key={member.id}
            member={member}
            onDelete={handleDelete}
            style={{ width: 400, margin: "5px auto" }}
          />
        ))}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { MemberListView };
export default MemberListView;
//@@viewOff:exports