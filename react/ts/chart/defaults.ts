import {
  ColorScaledBase,
  ColorScaledWithYAxis,
  MultiChannel,
  TrackMapSpec,
  LineChartSpec,
  ScatterChartSpec,
  HistogramChartSpec,
  Domain
} from "./types";
import { Polygon } from "geojson";

export const THROTTLE_POS_CH_IDX = 42;
export const WHEEL_SLIP_IDX = 38;
export const GROUND_SPEED_CH_IDX = 44;

export const DEFAULT_BASE_COLOR_SCALED: ColorScaledBase = {
  rangeType: "Colour-Scaled",
  nColorBins: null,
  colorAxis: THROTTLE_POS_CH_IDX
};

export const DEFAULT_COLOR_SCALED: ColorScaledWithYAxis = {
  ...DEFAULT_BASE_COLOR_SCALED,
  yAxis: WHEEL_SLIP_IDX
};

export const DEFAULT_MULTI_CHANNEL: MultiChannel = {
  rangeType: "Multi-Channel",
  yAxes: [[GROUND_SPEED_CH_IDX]]
};

export const DEFAULT_RANGE_TYPES = {
  "Colour-Scaled": DEFAULT_COLOR_SCALED,
  "Multi-Channel": DEFAULT_MULTI_CHANNEL
};

export const DEFAULT_DOMAIN_CHART: Domain = {
  title: ""
};

export const DEFAULT_TRACK_MAP: TrackMapSpec = {
  ...DEFAULT_DOMAIN_CHART,
  domainType: "Track-Map",
  map: {
    inner: (null as unknown) as Polygon,
    outer: (null as unknown) as Polygon
  }, // TODO: populate with real data
  segments: 100,
  ...DEFAULT_BASE_COLOR_SCALED
};

export const DEFAULT_LINE_CHART: LineChartSpec = {
  ...DEFAULT_DOMAIN_CHART,
  domainType: "Line",
  xAxis: "Time",
  ...DEFAULT_MULTI_CHANNEL
};

export const DEFAULT_SCATTER_CHART: ScatterChartSpec = {
  ...DEFAULT_DOMAIN_CHART,
  domainType: "Scatter",
  trendline: false,
  xAxis: GROUND_SPEED_CH_IDX,
  ...DEFAULT_COLOR_SCALED
};

export const DEFAULT_HISTOGRAM_CHART: HistogramChartSpec = {
  ...DEFAULT_DOMAIN_CHART,
  domainType: "Histogram",
  nBins: 7,
  ...DEFAULT_MULTI_CHANNEL
};

export const DEFAULT_CHARTS = {
  "Track-Map": DEFAULT_TRACK_MAP,
  Line: DEFAULT_LINE_CHART,
  Scatter: DEFAULT_SCATTER_CHART,
  Histogram: DEFAULT_HISTOGRAM_CHART
};
