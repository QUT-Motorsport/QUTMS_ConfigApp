import React from "react";
import { QmsData } from "../../ts/qmsData";
import {
  ChartSpec,
  ChartSpecRT,
  TrackMapSpec,
  LineChartSpec,
  ScatterChartSpec,
  HistogramChartSpec,
  Range,
} from "../../ts/chart/types";

import HistogramChart from "./HistogramChart";
import LineChart from "./LineChart";
import ScatterChart from "./ScatterChart";
import TrackMapChart from "./TrackMapChart";
import { StateHook } from "../../ts/hooks";

type ChartProps = {
  data: QmsData;
  spec: ChartSpec;
  domainState: StateHook<Range>;
  showDomainSlider?: boolean;
};

export default function BaseChart({ spec, ...rest }: ChartProps) {
  return ChartSpecRT.match(
    () => <TrackMapChart spec={spec as TrackMapSpec} {...rest} />,

    // choose chart type based on domain
    ChartSpecRT.alternatives[1].intersectees[0].match(
      () => <LineChart spec={spec as LineChartSpec} {...rest} />,
      () => <ScatterChart spec={spec as ScatterChartSpec} {...rest} />,
      () => <HistogramChart spec={spec as HistogramChartSpec} {...rest} />
    )
  )(spec);
}
