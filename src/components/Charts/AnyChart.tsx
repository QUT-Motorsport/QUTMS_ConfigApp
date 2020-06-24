import React from "react";
import { QmsData, Range } from "../../ts/qmsData";

import Histogram, { HistogramChartSpec } from "./HistogramChart";
import Line, { LineChartSpec } from "./LineChart";
import Scatter, { ScatterChartSpec } from "./ScatterChart";
import TrackMap, { TrackMapSpec } from "./TrackMapChart";
import { StateHook } from "../../ts/hooks";

export type ChartRange = Range | undefined;

export type ChartSpec = {
  title: string;
};

export type AnyChartSpec =
  | TrackMapSpec
  | LineChartSpec
  | ScatterChartSpec
  | HistogramChartSpec;

export default function AnyChart({
  spec,
  ...rest
}: {
  data: QmsData;
  spec: AnyChartSpec;
  domainState: StateHook<ChartRange>;
  showDomainSlider?: boolean;
}) {
  return { TrackMap, Line, Scatter, Histogram }[spec.domainType]({
    spec,
    ...rest,
  });
}
