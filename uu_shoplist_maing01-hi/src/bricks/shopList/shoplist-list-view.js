//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi, useState, useRoute, useMemo } from "uu5g05";
import { useAlertBus } from "uu5g05-elements";
import { Grid } from "uu5tilesg02-elements";
import Tile from "./shoplist-tile";
import Config from "./config/config.js";
import UpdateModal from "./update-modal";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  tile: () => Config.Css.css({ marginBottom: 24 }),
  buttonArea: () => Config.Css.css({ textAlign: "center", marginBottom: 24 }),
};
//@@viewOff:css

//@@viewOn:helpers
function getShoplistDataObject(shoplistDataList, id) {
  // HINT: We need to also check newData where are newly created items
  // that don't meet filtering, sorting or paging criteria.
  const item =
    shoplistDataList.newData?.find((item) => item?.data.id === id) ||
    shoplistDataList.data.find((item) => item?.data.id === id);

  return item;
}

function getOpenShoplistDatalist(shoplistDataList) {
    const openList = shoplistDataList.filter(item => item.data.status === "open")
    return openList;
}
//@@viewOff:helpers

const ListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
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
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);
    const [, setRoute] = useRoute();
    const [updateData, setUpdateData] = useState({ open: false, id: undefined });
    const openList = getOpenShoplistDatalist(props.shoplistDataList.data)

    let activeDataObject;

    if (updateData.id) {
      activeDataObject = getShoplistDataObject(props.shoplistDataList, updateData.id);
    }

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

    async function handleUpdate(shoplistDataObject) {
      setUpdateData({ open: true, id: shoplistDataObject.data.id });
    }

    async function handleUpdateSubmit(shoplistDataObject, values) {
      try {
        shoplistDataObject.data.name = values.name
        await shoplistDataObject.handlerMap.update(shoplistDataObject.data);
      } catch (error) {
        ListView.logger.error("Error updating shoplist", error);
        showError(error, lsi.updateFail, error);
        return;
      }

      setUpdateData({ open: false });
    }

    async function handleArchive(shoplistDataObject) {
      try {
        shoplistDataObject.data.status = "archived"
        await shoplistDataObject.handlerMap.update(shoplistDataObject.data);
      } catch (error) {
        ListView.logger.error("Error updating shoplist", error);
        showError(error, lsi.updateFail, error);
        return;
      }
    }

    function handleUpdateCancel() {
      setUpdateData({ open: false });
    }

    function handleDetailOpen(shoplistDataObject) {
      setRoute("shoplistDetails", {id: shoplistDataObject.data.id, ownerId: shoplistDataObject.data.uuIdentity})
    }
    
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    const tileProps = {
      profileList: props.profileList,
      identity: props.identity,
      userList: props.userList,
      onDetail: handleDetailOpen,
      onDelete: handleDelete,
      onUpdate: handleUpdate,
      onArchive: handleArchive,
    };

    return (
      <div {...attrs}>
        <Grid
          data={openList}
          verticalGap={8}
          tileHeight={300}
          emptyState={lsi.noJokes}
        >
          <Tile {...tileProps} />
        </Grid>
        {updateData.open && activeDataObject && (
          <UpdateModal
            shoplistDataObject={activeDataObject}
            onSubmit={handleUpdateSubmit}
            onCancel={handleUpdateCancel}
            open
          />
        )}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports