import { Polygon } from "geojson";
import { ContinuouslyColourScaled, MultiChannel, WithYAxis } from "./types";
import { LineChartSpec } from "../../components/Charts/LineChart";
import { ScatterChartSpec } from "../../components/Charts/ScatterChart";
import { HistogramChartSpec } from "../../components/Charts/HistogramChart";
import { TrackMapSpec } from "../../components/Charts/TrackMapChart";
import { ChartSpec } from "../../components/Charts/AnyChart";

export const THROTTLE_POS_CH_IDX = 42;
export const WHEEL_SLIP_IDX = 38;
export const GROUND_SPEED_CH_IDX = 44;

export const DEFAULT_BASE_COLOR_SCALED: ContinuouslyColourScaled = {
  rangeType: "ColourScaled",
  colourAxis: THROTTLE_POS_CH_IDX,
};

export const DEFAULT_COLOR_SCALED: ContinuouslyColourScaled & WithYAxis = {
  ...DEFAULT_BASE_COLOR_SCALED,
  yAxis: WHEEL_SLIP_IDX,
};

export const DEFAULT_MULTI_CHANNEL: MultiChannel = {
  rangeType: "MultiChannel",
  yAxes: [[GROUND_SPEED_CH_IDX]],
};

export const DEFAULT_RANGE_TYPES = {
  ColourScaled: DEFAULT_COLOR_SCALED,
  MultiChannel: DEFAULT_MULTI_CHANNEL,
};

export const DEFAULT_CHART_SPEC: ChartSpec = {
  title: "",
};

export const DEFAULT_TRACK_MAP: TrackMapSpec = {
  ...DEFAULT_CHART_SPEC,
  domainType: "TrackMap",
  map: {
    inner: (null as unknown) as Polygon,
    outer: (null as unknown) as Polygon,
  }, // TODO: populate with real data
  segments: 100,
  ...DEFAULT_BASE_COLOR_SCALED,
};

export const DEFAULT_LINE_CHART: LineChartSpec = {
  ...DEFAULT_CHART_SPEC,
  domainType: "Line",
  xAxis: "Time",
  ...DEFAULT_MULTI_CHANNEL,
};

export const DEFAULT_SCATTER_CHART: ScatterChartSpec = {
  ...DEFAULT_CHART_SPEC,
  domainType: "Scatter",
  showTrendline: false,
  xAxis: GROUND_SPEED_CH_IDX,
  ...DEFAULT_COLOR_SCALED,
};

export const DEFAULT_HISTOGRAM_CHART: HistogramChartSpec = {
  ...DEFAULT_CHART_SPEC,
  domainType: "Histogram",
  nBins: 7,
  ...DEFAULT_MULTI_CHANNEL,
};

export const DEFAULT_CHARTS = {
  "Track-Map": DEFAULT_TRACK_MAP,
  Line: DEFAULT_LINE_CHART,
  Scatter: DEFAULT_SCATTER_CHART,
  Histogram: DEFAULT_HISTOGRAM_CHART,
};
