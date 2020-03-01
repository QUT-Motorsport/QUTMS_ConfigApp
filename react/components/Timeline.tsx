import dynamic from "next/dynamic";
import { Spin } from "antd";
import { ComponentProps } from "react";
import { LineChartSpec } from "../ts/chart/types";
import { GROUND_SPEED_CH_IDX } from "../ts/chart/defaults";

const LineChart = dynamic(() => import("../components/Charts/Line"), {
  ssr: false,
  loading: () => <Spin />
});

const TIMELINE_SPEC: LineChartSpec = {
  title: "",
  domainType: "Line",
  xAxis: "Time",
  rangeType: "Multi-Channel",
  yAxes: [[GROUND_SPEED_CH_IDX]]
};
export default ({
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
