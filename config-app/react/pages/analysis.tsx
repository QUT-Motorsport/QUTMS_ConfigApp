import dynamic from "next/dynamic";
import { Spin, Select, Button, Modal } from "antd";
import { Union, Literal, Static } from "runtypes";
import AnalysisMenu from "../components/Layout/AnalysisMenu";
import SubHeader from "../components/Layout/SubHeader";
import { StateHook } from "../ts/hooks";
import { useQmsData } from "../ts/qmsData";
import "../styles/home.css";
import { useState } from "react";

const { Option } = Select;

const WorkSheet = dynamic(() => import("../components/WorkSheet"), {
  ssr: false
});

const ChartRunType = Union(
  Literal("Line"),
  Literal("Scatter"),
  Literal("Box Plot"),
  Literal("Histogram")
);
type ChartType = Static<typeof ChartRunType>;

const AddChartModal = ({
  onAddChart,
  _visibleState: [visible, setVisible] = useState<boolean>(false),
  _selectionState: [selection, setSelection] = useState<ChartType>("Line")
}: {
  onAddChart: (type: ChartType) => void;
  _visibleState: StateHook<boolean>;
  _selectionState: StateHook<ChartType>;
}) => {
  const onSubmit = () => onAddChart(selection);

  return (
    <div className="add-component">
      <Button type="primary" onClick={() => setVisible(true)}>
        + Add Chart
      </Button>
      <Modal
        title="Add Component"
        visible={visible}
        onOk={onSubmit} //use this to handle add component
        style={{ top: 300 }}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="submit" type="primary" onClick={onSubmit}>
            Create Component
          </Button>
        ]}
      >
        <div>
          <div className="modal-cat" style={{ float: "left" }}>
            Display Type:
          </div>
          <div>
            <Select
              onChange={setSelection}
              style={{ width: 120, marginLeft: "15px" }}
            >
              {ChartRunType.alternatives.map(({ value: chartType }, idx) => (
                <Option key={idx} value={chartType}>
                  {chartType}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <div>group selection bar goes here</div>
        </div>
        <div>
          <div>table goes here</div>
        </div>
      </Modal>
    </div>
  );
};

export default ({ data = useQmsData("Sample") }) =>
  data ? (
    <div className="flex-container-menu">
      <AnalysisMenu data={data} />
      <div className="flex-container-analysis">
        <SubHeader />
        <WorkSheet
          data={data}
          charts={[
            { channel_idxs: [40, 41, 42] },
            { channel_idxs: [36, 37, 38] }
          ]}
        />
        {/* <AddChartModal /> */}
      </div>
    </div>
  ) : (
    <Spin />
  );
