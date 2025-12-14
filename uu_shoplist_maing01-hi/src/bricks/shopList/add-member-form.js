//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi } from "uu5g05";
import { Form, FormSelect, SubmitButton, CancelButton } from "uu5g05-forms";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  input: () => Config.Css.css({ marginBottom: 16 }),
  controls: () => Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" }),
};
//@@viewOff:css

//@@viewOn:helpers
function getUserItemList(userList) {
  return userList.map((user) => {
    return { value: user.uuIdentity, children: user.name };
  });
}
//@@viewOff:helpers

const AddMemberForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AddMemberForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    userList: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onSubmit: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [AddMemberForm.uu5Tag]);

    function handleValidate(event) {
      const { member } = event.data.value;

      if (!member) {
        return {
          message: lsi.required,
        };
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    return (
      <Form {...elementProps} onSubmit={props.onSubmit} onValidate={handleValidate}>
        <FormSelect
                  label={lsi.member}
                  name="member"
                  itemList={getUserItemList(props.userList)}
                  className={Css.input()}
                  required
                />
        <div className={Css.controls()}>
          <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
          <SubmitButton>{lsi.submit}</SubmitButton>
        </div>
      </Form>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AddMemberForm };
export default AddMemberForm;
//@@viewOff:exports