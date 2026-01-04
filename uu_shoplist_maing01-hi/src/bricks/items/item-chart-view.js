//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useLsi } from "uu5g05";
import { PieChart } from "uu5chartsg01";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:helpers

//@@viewOff:helpers

const ItemChartView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ItemChartView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    itemDataList: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const resolvedItems = props.itemDataList.data.filter(item => item.data.status === "resolved")
    const unresolvedItems = props.itemDataList.data.filter(item => item.data.status === "unresolved")
    const lsi = useLsi(importLsi, [ItemChartView.uu5Tag]);
    const data = [{ label: lsi.unresolved, value: unresolvedItems.length},{label: lsi.resolved, value: resolvedItems.length}]
    const series = [{
        labelKey: "label",
        valueKey: "value",
        label: {type: "label"},
        color:
            (item) => {const { label } = item;
                switch (label) {
                    case "Resolved":
                        return "green";
                    case "Potvrzené":
                        return "green";
                    case "Unresolved":
                        return "red";
                    case "Otevřené":
                        return "red";
                }
            },
        outerRadius: 110,
        innerRadius: 80}];
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    return (
      <div {...attrs}>
        <PieChart
            data={data}
            serieList={series}
            legend={{position:"bottom"}}
        />
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ItemChartView };
export default ItemChartView;
//@@viewOff:exports