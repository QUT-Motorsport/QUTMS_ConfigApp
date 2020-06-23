import React from "react";
import { QmsData, Range } from "../../ts/qmsData";

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
  domainState: StateHook<ChartRange>;
  showDomainSlider?: boolean;
}) {
  switch (spec.domainType) {
    case "Track-Map":
      return <TrackMapChart spec={spec} {...rest} />;
    case "Line":
      return <LineChart spec={spec} {...rest} />;
    case "Scatter":
      return <ScatterChart spec={spec} {...rest} />;
    case "Histogram":
      return <HistogramChart spec={spec} {...rest} />;
  }
}
