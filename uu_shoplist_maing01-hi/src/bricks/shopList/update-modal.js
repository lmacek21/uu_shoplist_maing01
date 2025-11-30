//@@viewOn:imports
import { createVisualComponent, PropTypes, useLsi } from "uu5g05";
import { Modal } from "uu5g05-elements";
import { Form, FormText, SubmitButton, CancelButton } from "uu5g05-forms";
import Config from "./config/config";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  input: () => Config.Css.css({ marginBottom: 16 }),
  controls: () => Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" }),
};
//@@viewOff:css

//@@viewOn:helpers

//@@viewOff:helpers

export const UpdateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    shoplistDataObject: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [UpdateModal.uu5Tag]);

    async function handleSubmit(event) {
      const values = { ...event.data.value };
      return props.onSubmit(props.shoplistDataObject, values);
    }

    function handleValidate(event) {
      const { name } = event.data.value;

      if (!name) {
        return {
          message: lsi.required,
        };
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const shoplist = props.shoplistDataObject.data;

    const formControls = (
      <div className={Css.controls()}>
        <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
        <SubmitButton>{lsi.submit}</SubmitButton>
      </div>
    );

    return (
      <Form.Provider onSubmit={handleSubmit} onValidate={handleValidate}>
        <Modal header={lsi.header} footer={formControls} open>
          <Form.View>
            <FormText
              label={lsi.name}
              name="name"
              initialValue={shoplist.name}
              maxLength={255}
              className={Css.input()}
              required
              autoFocus
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

export default UpdateModal;