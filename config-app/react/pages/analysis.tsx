import dynamic from "next/dynamic";
import { useState, ComponentProps } from "react";
import { Spin, Select, Button, Modal, Form } from "antd";
import { TwitterPicker } from "react-color";

import AnalysisMenu from "../components/Layout/AnalysisMenu";
import Explorer from "../components/Layout/Explorer/Explorer";
import SubHeader from "../components/Layout/SubHeader";
import Head from "next/head";

import { ChartSpec, ChartTypeEnum, Range } from "../ts/chartTypes";
import { StateHook } from "../ts/hooks";
import { useQmsData, QmsData } from "../ts/qmsData";

const Chart = dynamic(() => import("../components/Chart"), {
  ssr: false,
  loading: () => <Spin />
});

const AddChartModal = ({
  onAddChart,
  data,
  _visibleState: [visible, setVisible] = useState<boolean>(false),
  _chartSpecState: [chartSpec, setChartSpec] = useState<ChartSpec>({
    type: "Line",
    channelIdxs: []
  })
}: {
  onAddChart: (type: ChartSpec) => void;
  data: QmsData;
  _visibleState?: StateHook<boolean>;
  _chartSpecState?: StateHook<ChartSpec>;
}) => {
  const isValid = chartSpec.channelIdxs.length > 0;
  const onSubmit = () => (isValid ? onAddChart(chartSpec) : null);

  return (
    <>
      <Head>
        <title>QUT Config App - Home</title>
      </Head>
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
          onOk={onSubmit}
          okButtonProps={{ disabled: !isValid }}
          onCancel={() => setVisible(false)}
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
                {ChartTypeEnum.alternatives.map(({ value: chartType }, idx) => (
                  <Select.Option key={idx} value={chartType}>
                    {chartType}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Channels"
              wrapperCol={{ xs: { span: 18 }, sm: { span: 16 } }}
            >
              <Select
                mode="multiple"
                optionFilterProp="children"
                value={chartSpec.channelIdxs}
                onChange={(channelIdxs: ChartSpec["channelIdxs"]) =>
                  setChartSpec({ ...chartSpec, channelIdxs })
                }
              >
                {data.channels.map(({ name, freq, unit }, idx) => (
                  <Select.Option
                    key={idx}
                    value={idx}
                    label={name}
                    title={name}
                  >
                    {`${name} ${unit ? `(${unit})` : ""} [${freq} hz]`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
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
    <>
      <div className="flex-container-menu">
        {/* Side bar menu  */}
        <div>
          <AnalysisMenu data={data} />
        </div>
        {/* Content of page - i.e. graphing/data goes here */}
        <div className="flex-container-analysis">
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
      <Head>
        <title>QUT ConfigHub - Analysis</title>
      </Head>
    </>
  ) : (
    <Spin />
  );
