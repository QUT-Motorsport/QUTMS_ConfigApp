import dynamic from "next/dynamic";
import { useState, ComponentProps } from "react";
import { Spin, Select, Button, Modal } from "antd";

import AnalysisMenu from "../components/Layout/AnalysisMenu";
import SubHeader from "../components/Layout/SubHeader";

import { ChartSpec, ChartTypeEnum, Range } from "../ts/chartTypes";
import { StateHook } from "../ts/hooks";
import { useQmsData } from "../ts/qmsData";

const Chart = dynamic(() => import("../components/Chart"), {
  ssr: false,
  loading: () => <Spin />
});

const { Option } = Select;

// needs to be a separate subcomponent for styled-jsx because antd does funky stuff with modals
const AddChartForm = ({
  chartSpecState: [chartSpec, setChartSpec] = useState<ChartSpec>({
    type: "Line",
    channelIdxs: []
  })
}: {
  chartSpecState: StateHook<ChartSpec>;
}) => (
  <div className="root">
    <style jsx>{`
      .root :global(.chart-type-select) {
        width: 120px;
        margin-left: 15px;
      }

      .form-control {
        margin-bottom: 5px;
      }
    `}</style>
    <div className="form-control">
      Display Type:
      <Select
        className="chart-type-select"
        value={chartSpec.type}
        onChange={(type: ChartSpec["type"]) =>
          setChartSpec({ ...chartSpec, type })
        }
      >
        {ChartTypeEnum.alternatives.map(({ value: chartType }, idx) => (
          <Option key={idx} value={chartType}>
            {chartType}
          </Option>
        ))}
      </Select>
    </div>
    <div>
      Display Type:
      <Select
        className="chart-type-select"
        value={chartSpec.type}
        onChange={(type: ChartSpec["type"]) =>
          setChartSpec({ ...chartSpec, type })
        }
      >
        {ChartTypeEnum.alternatives.map(({ value: chartType }, idx) => (
          <Option key={idx} value={chartType}>
            {chartType}
          </Option>
        ))}
      </Select>
    </div>
    <div></div>
  </div>
);

const AddChartModal = ({
  onAddChart,
  _visibleState: [visible, setVisible] = useState<boolean>(false),
  _chartSpecState: [chartSpec, setChartSpec] = useState<ChartSpec>({
    type: "Line",
    channelIdxs: []
  })
}: {
  onAddChart: (type: ChartSpec) => void;
  _visibleState?: StateHook<boolean>;
  _chartSpecState?: StateHook<ChartSpec>;
}) => {
  const isValid = chartSpec.channelIdxs.length > 0;
  const onSubmit = () => (isValid ? onAddChart(chartSpec) : null);

  return (
    <div className="root">
      <style jsx>{`
        .root {
          position: absolute;
          bottom: 10px;
          align-self: center;
          padding-right: 150px;
        }
      `}</style>

      <Button type="primary" onClick={() => setVisible(true)}>
        + Add Chart
      </Button>

      <Modal
        title="Add Chart"
        visible={visible}
        onOk={onSubmit} //use this to handle add component
        style={{ top: 300 }}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={onSubmit}
            disabled={!isValid}
          >
            Create Chart
          </Button>
        ]}
      >
        <AddChartForm chartSpecState={[chartSpec, setChartSpec]} />
      </Modal>
    </div>
  );
};

const TIMELINE_IDXS = [44 /* Ground Speed Ch Idx */];
const Timeline = ({
  data,
  domainState
}: Pick<ComponentProps<typeof Chart>, "data" | "domainState">) => (
  <div className="root">
    <style jsx>{`
      // TODO: Enable styled-jsx-postcss-plugin to DRY this up

      .root {
        width: 100%;
        height: 40px;
        overflow: hidden;
      }

      .root > :global(.js-plotly-plot) {
        width: calc(100% + 153px) !important;
        height: 450px !important;
      }

      .root > :global(.js-plotly-plot) :global(.modebar) {
        display: none;
      }

      .root > :global(.js-plotly-plot) :global(.cartesianlayer) {
        display: none;
      }

      .root > :global(.js-plotly-plot) :global(.hoverlayer) {
        display: none;
      }

      .root > :global(.js-plotly-plot) :global(.draglayer) {
        display: none;
      }

      .root > :global(.js-plotly-plot) :global(.rangeslider-container) {
        transform: translate(3px, 0);
      }
    `}</style>
    <Chart
      data={data}
      type={"Line"}
      channelIdxs={TIMELINE_IDXS}
      domainState={domainState}
      showRangeSlider={true}
    />
  </div>
);

export default ({
  data = useQmsData("Sample"),
  _domainState: domainState = useState<Range>(),
  _chartsState: [charts, setCharts] = useState<ChartSpec[]>([
    {
      type: "Line",
      channelIdxs: [36, 37, 38]
    },
    {
      type: "Line",
      channelIdxs: [39, 40, 41]
    }
  ])
}) =>
  data ? (
    <div className="flex-container-menu">
      <AnalysisMenu data={data} />
      <div className="flex-container-analysis">
        <SubHeader />

        <Timeline data={data} domainState={domainState} />
        {charts.map((chartSpec, idx) => (
          <Chart
            key={idx}
            data={data}
            domainState={domainState}
            {...chartSpec}
          />
        ))}
        <AddChartModal onAddChart={chart => setCharts([...charts, chart])} />
      </div>
    </div>
  ) : (
    <Spin />
  );
