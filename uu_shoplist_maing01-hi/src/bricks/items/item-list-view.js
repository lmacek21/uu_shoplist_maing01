//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, Lsi, useLsi, useState } from "uu5g05";
import { useAlertBus, Text } from "uu5g05-elements";
import { Grid } from "uu5tilesg02-elements";
import ItemTile from "./item-tile";
import Config from "./config/config.js";
import UpdateModal from "./update-modal";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:helpers
function getItemDataObject(itemDataList, id) {
  // HINT: We need to also check newData where are newly created items
  // that don't meet filtering, sorting or paging criteria.
  const item =
    itemDataList.newData?.find((item) => item?.data.id === id) ||
    itemDataList.data.find((item) => item?.data.id === id);

  return item;
}

//@@viewOff:helpers

const ItemListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ItemListView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    itemDataList: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    ownerId: PropTypes.object,
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
    const lsi = useLsi(importLsi, [ItemListView.uu5Tag]);
    const [updateData, setUpdateData] = useState({ open: false, id: undefined });

    let activeDataObject;

    if (updateData.id) {
      activeDataObject = getItemDataObject(props.itemDataList, updateData.id);
    }

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    async function handleDelete(itemDataObject) {
      try {
        await itemDataObject.handlerMap.delete();
      } catch (error) {
        ItemListView.logger.error("Error deleting item", error);
        showError(error, lsi.deleteFail);
        return;
      }

      addAlert({
        message: Utils.String.format(lsi.deleteDone, itemDataObject.data.name),
        priority: "success",
        durationMs: 2000,
      });
    }

    async function handleResolve(itemDataObject) {
      try {
        itemDataObject.data.status = "resolved"
        await itemDataObject.handlerMap.update(itemDataObject.data);
      } catch (error) {
        ItemListView.logger.error("Error resolving item", error);
        showError(error, lsi.deleteFail);
        return;
      }
    }

    async function handleUpdate(itemDataObject) {
      setUpdateData({ open: true, id: itemDataObject.data.id });
    }

    async function handleUpdateSubmit(itemDataObject, values) {
      try {
        itemDataObject.data.name = values.name
        await itemDataObject.handlerMap.update(itemDataObject.data);
      } catch (error) {
        ItemListView.logger.error("Error updating item", error);
        showError(error, lsi.updateFail, error);
        return;
      }

      setUpdateData({ open: false });
    }

    function handleUpdateCancel() {
      setUpdateData({ open: false });
    }

    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    const tileProps = {
      profileList: props.profileList,
      identity: props.identity,
      userList: props.userList,
      ownerId: props.ownerId,
      onDelete: handleDelete,
      onUpdate: handleUpdate,
      onResolve: handleResolve,
    };

    return (
      <div {...attrs}>
        <Grid
          data={props.itemDataList.data}
          verticalGap={2}
          tileHeight={50}
          emptyState={lsi.noJokes}
        >
          <ItemTile {...tileProps} />
        </Grid>
        {updateData.open && activeDataObject && (
          <UpdateModal
            itemDataObject={activeDataObject}
            userList={props.userList}
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
export { ItemListView };
export default ItemListView;
//@@viewOff:exports