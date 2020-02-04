import { Button, Form, Modal, Select, Spin } from "antd";
import dynamic from "next/dynamic";
import { ComponentProps, useState } from "react";
import { Static } from  
import AnalysisMenu from "../components/Layout/AnalysisMenu";
import SubHeader from "../components/Layout/SubHeader";
import { ChartSpec, ChartSpecRT, Range } from "../ts/chartTypes";
import { StateHook } from "../ts/hooks";
import { QmsData, useQmsData } from "../ts/qmsData";

const Chart = dynamic(() => import("../components/Charts/Line"), {
  ssr: false,
  loading: () => <Spin />
});

const DEFAULT_CHART_SPEC: ChartSpec = {
  type: "Line",
  xa: []
};

const ChartEditor = (data: QmsData, chart: ChartSpec) =>
  ChartSpecRT.match(
    Unimplemented("TrackMapChartEditor"),
    (() => {
      const [XAxisRTs, YAxisRTs] = ChartSpecRT.alternatives[1].intersectees;
      return XAxisRTs.match(
        Unimplemented("LineChartEditor"),
        Unimplemented("ScatterChartEditor"),
        Unimplemented("HistogramChartEditor"),
      )
    })()
  )(chart);

const Unimplemented = (component: string) => () => <div style={{ color: "red"}}>Sorry! {component} hasn't been implemented yet!</div>

const LineChartEditor = ({ channelIdxs }: ChartSpec) => (
  <Form.Item
    label="Channels"
    wrapperCol={{ xs: { span: 18 }, sm: { span: 16 } }}
  >
    <Select
      mode="multiple"
      optionFilterProp="children"
      value={channelIdxs}
      onChange={(channelIdxs: ChartSpec["channelIdxs"]) =>
        setChartSpec({ ...chartSpec, channelIdxs })
      }
    >
      {data.channels.map(({ name, freq, unit }, idx) => (
        <Select.Option key={idx} value={idx} label={name} title={name}>
          {`${name} ${unit ? `(${unit})` : ""} [${freq} hz]`}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
);

const AddChartModal = ({
  onAddChart,
  data,
  _visibleState: [visible, setVisible] = useState<boolean>(false),
  _chartSpecState: [chartSpec, setChartSpec] = useState<ChartSpec>(
    DEFAULT_CHART_SPEC
  )
}: {
  onAddChart: (type: ChartSpec) => void;
  data: QmsData;
  _visibleState?: StateHook<boolean>;
  _chartSpecState?: StateHook<ChartSpec>;
}) => {
  const isValid = chartSpec.channelIdxs.length > 0;
  const closeModal = () => {
    setChartSpec(DEFAULT_CHART_SPEC);
    setVisible(false);
  };

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
          if (isValid) {
            onAddChart(chartSpec);
            closeModal();
          }
        }} //use this to handle add component
        okButtonProps={{ disabled: !isValid }}
        onCancel={closeModal}
      >
        <Form labelCol={{ xs: { span: 6 } }}>
          <Form.Item
            label="Chart Type"
            wrapperCol={{ xs: { span: 18 }, sm: { span: 6 } }}
          >
            <Select
              value={chartSpec.type}
              onChange={(type: ChartSpec["type"]) =>
                setChartSpec({ ...chartSpec, type })
              }
            >
              {ChartSpecRT.alternatives.map(
                (
                  {
                    fields: {
                      type: { value: chartType }
                    }
                  }: { fields: { type: { value: ChartSpec["type"] } } },
                  idx: number
                ) => (
                  <Select.Option key={idx} value={chartType}>
                    {chartType}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>
        </Form>
        <Chart data={data} {...chartSpec} />
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
  _chartsState: [charts, setCharts] = useState<ChartSpec[]>([])
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
        <AddChartModal
          data={data}
          onAddChart={chart => setCharts([...charts, chart])}
        />
      </div>
    </div>
  ) : (
    <Spin />
  );
