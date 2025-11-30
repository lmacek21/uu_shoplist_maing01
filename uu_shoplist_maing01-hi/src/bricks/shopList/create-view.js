//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useState } from "uu5g05";
import { Button, useAlertBus } from "uu5g05-elements";
import CreateForm from "./create-form.js";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  button: () => Config.Css.css({ display: "block", margin: "0px", marginRight: "auto" }),
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
      Create Shoplist
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
    userList: PropTypes.array,
    onCreate: PropTypes.func,
    identity: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    userList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [mode, setMode] = useState(Mode.BUTTON);
    const { addAlert } = useAlertBus();

    async function handleSubmit(event) {
      let shoplist;

      try {
        let dtoIn = event.data.value 
        dtoIn.id = Utils.String.generateId()
        dtoIn.uuIdentity = props.identity.uuIdentity
        dtoIn.uuIdentityName = props.identity.name
        shoplist = await props.shoplistDataList.handlerMap.create(dtoIn)
        console.log(shoplist)
      } catch (error) {
        CreateView.logger.error("Error while creating shoplist", error);
        addAlert({
          header: "Shoplist creation failed!",
          message: error.message,
          priority: "error",
        });
        return;
      }

      addAlert({
        message: `Shoplist ${shoplist.name} has been created.`,
        priority: "success",
        durationMs: 2000,
      });

      setMode(Mode.BUTTON);
    }
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    let content;

    switch (mode) {
      case Mode.BUTTON:
        content = <CreateButton onClick={() => setMode(Mode.FORM)} />;
        break;
      default:
        content = <CreateForm 
                    onSubmit={handleSubmit}
                    onCancel={() => setMode(Mode.BUTTON)}
                    userList={props.userList}
                  />;
        break;
    }

    return <div {...attrs}>{content}</div>;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateView };
export default CreateView;
//@@viewOff:exports