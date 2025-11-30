//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useState } from "uu5g05";
import { Button, useAlertBus } from "uu5g05-elements";
import CreateForm from "./create-form.js";
import Config from "./config/config.js";
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
      Create item
    </Button>
  );
}
//@@viewOff:helpers

const CreateView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onCreate: PropTypes.func,
    identity: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onCreate: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    const [mode, setMode] = useState(Mode.BUTTON);

    async function handleSubmit(event) {
      let item;

      try {
        let dtoIn = event.data.value
        dtoIn.id = Utils.String.generateId()
        item = await props.itemDataList.handlerMap.create(dtoIn)
      } catch (error) {
        CreateView.logger.error("Error while creating item", error);
        addAlert({
          header: "Item creation failed!",
          message: error.message,
          priority: "error",
        });
        return;
      }

      addAlert({
        message: `Item ${item.name} has been created.`,
        priority: "success",
        durationMs: 2000,
      });

      setMode(Mode.BUTTON);
    }
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    switch (mode) {
      case Mode.BUTTON:
        return <CreateButton {...elementProps} onClick={() => setMode(Mode.FORM)} />;
      default:
        return <CreateForm {...elementProps} onSubmit={handleSubmit} onCancel={() => setMode(Mode.BUTTON)} />;
    }
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateView };
export default CreateView;
//@@viewOff:exports