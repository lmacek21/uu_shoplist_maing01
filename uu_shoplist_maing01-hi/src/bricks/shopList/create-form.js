//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi } from "uu5g05";
import { Form, FormText, FormSelect, FormFile, FormTextArea, SubmitButton, CancelButton } from "uu5g05-forms";
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

const CreateForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    userList: PropTypes.array,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    userList: [],
    onSubmit: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [CreateForm.uu5Tag]);

    function handleValidate(event) {
      const { name } = event.data.value;

      if (!name) {
        return {
          message: lsi.textOrImage,
        };
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    return (
      <Form {...elementProps} onSubmit={props.onSubmit} onValidate={handleValidate}>
        <FormText label={lsi.name} name="name" maxLength={255} className={Css.input()} required autoFocus />

        <FormSelect
          label={lsi.member}
          name="userIdList"
          itemList={getUserItemList(props.userList)}
          className={Css.input()}
          multiple
        />

        {/* <FormFile label={lsi.image} name="image" accept="image/*" className={Css.input()} /> */}

        {/* <FormTextArea label={lsi.text} name="text" maxLength={4000} rows={10} className={Css.input()} autoResize /> */}

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
export { CreateForm };
export default CreateForm;
//@@viewOff:exports