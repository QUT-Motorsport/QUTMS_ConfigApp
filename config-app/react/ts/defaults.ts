import {
  ColorScaledBase,
  ColorScaledWithYAxis,
  MultiChannel,
  TrackMapSpec,
  LineChartSpec,
  ScatterChartSpec,
  HistogramChartSpec
} from "./chartTypes";
import { Polygon } from "geojson";

export const THROTTLE_POS_CH_IDX = 42;
export const GROUND_SPEED_CH_IDX = 44;

export const defaultBaseColorScaled: ColorScaledBase = {
  rangeType: "Colour-Scaled",
  nColorBins: 10,
  colorAxis: THROTTLE_POS_CH_IDX
};

const defaultColorScaled: ColorScaledWithYAxis = {
  ...defaultBaseColorScaled,
  yAxis: GROUND_SPEED_CH_IDX
};

const defaultMultiChannel: MultiChannel = {
  rangeType: "Multi-Channel",
  yAxes: [[GROUND_SPEED_CH_IDX]]
};

export const defaultRangeTypes = {
  "Colour-Scaled": defaultColorScaled,
  "Multi-Channel": defaultMultiChannel
};

const defaultTrackMap: TrackMapSpec = {
  domainType: "Track-Map",
  map: {
    inner: (null as unknown) as Polygon,
    outer: (null as unknown) as Polygon
  }, // TODO: populate with real data
  segments: 100,
  ...defaultBaseColorScaled
};

const defaultLineChart: LineChartSpec = {
  domainType: "Line",
  xAxis: "Time",
  ...defaultRangeTypes["Multi-Channel"]
};

const defaultScatterChart: ScatterChartSpec = {
  domainType: "Scatter",
  trendline: false,
  xAxis: GROUND_SPEED_CH_IDX,
  ...defaultRangeTypes["Colour-Scaled"]
};

const defaultHistogramChart: HistogramChartSpec = {
  domainType: "Histogram",
  nBins: 7,
  ...defaultRangeTypes["Multi-Channel"]
};

export const defaultCharts = {
  "Track-Map": defaultTrackMap,
  Line: defaultLineChart,
  Scatter: defaultScatterChart,
  Histogram: defaultHistogramChart
};
