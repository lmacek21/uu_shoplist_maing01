//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi} from "uu5g05";
import { Grid } from "uu5tilesg02-elements";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
import ShoplistMemberTile from "./shoplist-member-tile";
//@@viewOff:imports


const ShoplistMemberView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ShoplistMemberView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    shoplistDataObject: PropTypes.object.isRequired,
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
    const lsi = useLsi(importLsi, [ShoplistMemberView.uu5Tag]);

    async function handleUpdate(values) {
      try {
        const shoplist = props.shoplistDataObject
        const members = shoplist.data.memberList.filter(m => m.uuIdentity !== values.uuIdentity)
        shoplist.data.memberList = members
        await shoplist.handlerMap.update(shoplist.data);
      } catch (error) {
        ShoplistMemberView.logger.error("Error updating members", error);
        showError(error, lsi.updateFail, error);
        return;
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    const tileProps = {
      profileList: props.profileList,
      identity: props.identity,
      userList: props.userList,
      ownerId: props.ownerId,
      onDelete: handleUpdate
    };

    return (
      <div {...attrs}>
        <Grid
          data={props.shoplistDataObject.data.memberList}
          verticalGap={2}
          tileHeight={50}
        >
          <ShoplistMemberTile {...tileProps} />
        </Grid>
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ShoplistMemberView };
export default ShoplistMemberView;
//@@viewOff:exports