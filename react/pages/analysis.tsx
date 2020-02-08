import { Button, Modal, Spin } from "antd";
import dynamic from "next/dynamic";
import { ComponentProps, useState } from "react";
import AnalysisMenu from "../components/Layout/AnalysisMenu";
import SubHeader from "../components/Layout/SubHeader";
import Head from "next/head";
import { ChartSpec, Range, LineChartSpec } from "../ts/chartTypes";
import { StateHook } from "../ts/hooks";
import { QmsData, useQmsData } from "../ts/qmsData";
import { GROUND_SPEED_CH_IDX, DEFAULT_LINE_CHART } from "../ts/defaults";

import BaseChartEditor from "../components/Charts/Editors/Base";

const BaseChart = dynamic(() => import("../components/Charts/Base"), {
  ssr: false,
  loading: () => <Spin />
});

const LineChart = dynamic(() => import("../components/Charts/Line"), {
  ssr: false,
  loading: () => <Spin />
});

const AddChartModal = ({
  onAddChartSpec,
  data,
  _visibleState: [visible, setVisible] = useState<boolean>(false),
  _chartSpecState: chartSpecState = useState<ChartSpec>(DEFAULT_LINE_CHART)
}: {
  onAddChartSpec: (type: ChartSpec) => void;
  data: QmsData;
  _visibleState?: StateHook<boolean>;
  _chartSpecState?: StateHook<ChartSpec>;
}) => {
  const [chartSpec, setChartSpec] = chartSpecState;
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
        onOk={() => {
          onAddChartSpec(chartSpec);
          setChartSpec(DEFAULT_LINE_CHART);
          setVisible(false);
        }} // use this to handle add component
        onCancel={() => setVisible(false)}
      >
        <BaseChartEditor data={data} specState={chartSpecState} />
        <BaseChart data={data} spec={chartSpec} />
      </Modal>
    </div>
  );
};

const TIMELINE_SPEC: LineChartSpec = {
  title: "",
  domainType: "Line",
  xAxis: "Time",
  rangeType: "Multi-Channel",
  yAxes: [[GROUND_SPEED_CH_IDX]]
};
const Timeline = ({
  data,
  domainState
}: Pick<ComponentProps<typeof LineChart>, "data" | "domainState">) => (
  <div className="root">
    <style jsx>{`
      // TODO: Enable styled-jsx-postcss-plugin to DRY this up

      .root {
        width: 90%;
        margin-left: 5%;
        margin-right: 5%;
        margin-top: 10px;
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
      spec={TIMELINE_SPEC}
      domainState={domainState}
      showDomainSlider={true}
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
      <Head>
        <title>QUT Config App - Home</title>
      </Head>
      <AnalysisMenu data={data} />
      <div className="flex-container-analysis">
        <SubHeader />

        <Timeline data={data} domainState={domainState} />

        {chartSpecs.map((chartSpec, idx) => (
          <BaseChart
            key={idx}
            data={data}
            domainState={domainState}
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
      <Head>
        <title>QUT ConfigHub - Analysis</title>
      </Head>
    </div>
  ) : (
    <Spin />
  );
