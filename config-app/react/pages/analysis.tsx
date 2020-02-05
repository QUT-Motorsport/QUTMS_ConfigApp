import { Button, Modal, Spin } from "antd";
import dynamic from "next/dynamic";
import { ComponentProps, useState } from "react";
import AnalysisMenu from "../components/Layout/AnalysisMenu";
import SubHeader from "../components/Layout/SubHeader";
import { ChartSpec, Range } from "../ts/chartTypes";
import { StateHook } from "../ts/hooks";
import { QmsData, useQmsData } from "../ts/qmsData";

import BaseChartEditor from "../components/Charts/Editors/Base";

const BaseChart = dynamic(() => import("../components/Charts/Base"), {
  ssr: false,
  loading: () => <Spin />
});

const LineChart = dynamic(() => import("../components/Charts/Line"), {
  ssr: false,
  loading: () => <Spin />
});

export const DEFAULT_CHART_SPEC: ChartSpec = {
  domainType: "Line",
  rangeType: "Multi-Channel",
  xAxis: "Time",
  yAxis: []
};

const AddChartModal = ({
  onAddChartSpec,
  data,
  _visibleState: [visible, setVisible] = useState<boolean>(false),
  _chartSpecState: chartSpecState = useState<ChartSpec>(DEFAULT_CHART_SPEC)
}: {
  onAddChartSpec: (type: ChartSpec) => void;
  data: QmsData;
  _visibleState?: StateHook<boolean>;
  _chartSpecState?: StateHook<ChartSpec>;
}) => {
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
        width={800}
        onOk={() => setVisible(false)} // use this to handle add component
        onCancel={() => setVisible(false)}
      >
        <BaseChartEditor data={data} specState={chartSpecState} />
        {/* <BaseChart data={data} spec={chartSpecState[0]} /> */}
      </Modal>
    </div>
  );
};

const TIMELINE_IDXS = [44 /* Ground Speed Ch Idx */];
const Timeline = ({
  data,
  domainState
}: Pick<ComponentProps<typeof LineChart>, "data" | "domainState">) => (
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
    <LineChart
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
  _chartSpecsState: [chartSpecs, setChartSpecs] = useState<ChartSpec[]>([])
}) =>
  data ? (
    <div className="flex-container-menu">
      <AnalysisMenu data={data} />
      <div className="flex-container-analysis">
        <SubHeader />

        <Timeline data={data} domainState={domainState} />

        {chartSpecs.map((chartSpec, idx) => (
          <BaseChart
            key={idx}
            data={data}
            // domainState={domainState}
            spec={chartSpec}
          />
        ))}
        <AddChartModal
          data={data}
          onAddChartSpec={chartSpec =>
            setChartSpecs([...chartSpecs, chartSpec])
          }
        />
      </div>
    </div>
  ) : (
    <Spin />
  );
