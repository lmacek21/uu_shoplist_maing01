//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi, useRoute } from "uu5g05";
import { useAlertBus } from "uu5g05-elements";
import { Grid } from "uu5tilesg02-elements";
import ArchiveTile from "./shoplist-archive-tile";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  tile: () => Config.Css.css({ marginBottom: 24 }),
  buttonArea: () => Config.Css.css({ textAlign: "center", marginBottom: 24 }),
};
//@@viewOff:css

//@@viewOn:helpers
function getArchivedShoplistDatalist(shoplistDataList) {
    const archive = shoplistDataList.filter(item => item.data.status === "archived")
    return archive;
}
//@@viewOff:helpers

const ArchiveListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ArchiveListView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    shoplistDataList: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    userList: PropTypes.array,
    profileList: PropTypes.array,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    userList: [],
    profileList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    const lsi = useLsi(importLsi, [ArchiveListView.uu5Tag]);
    const [, setRoute] = useRoute();
    const archivedList = getArchivedShoplistDatalist(props.shoplistDataList.data)

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    async function handleDelete(shoplistDataObject) {
      try {
        await shoplistDataObject.handlerMap.delete();
      } catch (error) {
        ListView.logger.error("Error deleting shoplist", error);
        showError(error, lsi.deleteFail);
        return;
      }

      addAlert({
        message: Utils.String.format(lsi.deleteDone, shoplistDataObject.data.name),
        priority: "success",
        durationMs: 2000,
      });
    }

    function handleDetailOpen(shoplistDataObject) {
      setRoute("shoplistDetails", {id: shoplistDataObject.data.id})
    }
    
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    const tileProps = {
      profileList: props.profileList,
      identity: props.identity,
      userList: props.userList,
      onDelete: handleDelete,
      onDetail: handleDetailOpen
    };

    return (
      <div {...attrs}>
        <Grid
          data={archivedList}
          verticalGap={8}
          tileHeight={300}
        >
          <ArchiveTile {...tileProps} />
        </Grid>
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ArchiveListView };
export default ArchiveListView;