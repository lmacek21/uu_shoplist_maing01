//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useState, useLsi } from "uu5g05";
import { Button } from "uu5g05-elements";
import AddMemberForm from "./add-member-form.js";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  button: () => Config.Css.css({ display: "block", margin: "0px 24px", marginLeft: "auto" }),
};
//@@viewOff:css

//@@viewOn:constants
const Mode = {
  BUTTON: "BUTTON",
  FORM: "FORM",
};
//@@viewOff:constants

//@@viewOn:helpers
function CreateButton(props) {
  return (
    <Button {...props} colorScheme="primary" significance="highlighted" className={Css.button()}>
      {props.name}
    </Button>
  );
}
//@@viewOff:helpers

const AddMemberView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AddMemberView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    shoplistDataObject: PropTypes.object,
    userList: PropTypes.object,
    onUpdate: PropTypes.func,
    identity: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onUpdate: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [mode, setMode] = useState(Mode.BUTTON);
    const lsi = useLsi(importLsi, [AddMemberView.uu5Tag]);

    async function handleSubmit(event) {
      try {
        const id = event.data.value.member
        const newMember = props.userList.filter(u => u.uuIdentity === id)
        const shoplist = props.shoplistDataObject
        const exist = shoplist.data.memberList.filter(m => m.uuIdentity === id)
        if(!exist.length){
        shoplist.data.memberList.push(newMember[0])
        }
        await shoplist.handlerMap.update(shoplist.data);
      } catch (error) {
        AddMemberView.logger.error("Error updating members", error);
        showError(error, lsi.updateFail, error);
        return;
      }

      setMode(Mode.BUTTON);
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    switch (mode) {
      case Mode.BUTTON:
        return <CreateButton {...elementProps} onClick={() => setMode(Mode.FORM)} name={lsi.button} />;
      default:
        return <AddMemberForm {...elementProps} onSubmit={handleSubmit} onCancel={() => setMode(Mode.BUTTON) } userList={props.userList}/>;
    }
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AddMemberView };
export default AddMemberView;
//@@viewOff:exports