import React from "react";
import { QmsData, Range, CrossFilter } from "../../ts/qmsData";

import HistogramChart, { HistogramChartSpec } from "./HistogramChart";
import LineChart, { LineChartSpec } from "./LineChart";
import ScatterChart, { ScatterChartSpec } from "./ScatterChart";
import TrackMapChart, { TrackMapSpec } from "./TrackMapChart";
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
  filterState: StateHook<CrossFilter>;
}) {
  return spec.domainType === "Line" ? (
    <LineChart spec={spec} {...rest} />
  ) : spec.domainType === "Scatter" ? (
    <ScatterChart spec={spec} {...rest} />
  ) : spec.domainType === "Histogram" ? (
    <HistogramChart spec={spec} {...rest} />
  ) : (
    <TrackMapChart spec={spec} {...rest} />
  );
}
