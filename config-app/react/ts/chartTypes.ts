import {
  Union,
  Literal,
  Static,
  Number,
  Undefined,
  Array,
  Record,
  Boolean,
  Unknown
} from "runtypes";
import { Polygon } from "geojson";

const ChannelIdxRT = Number;

export type ChannelIdx = Static<typeof ChannelIdxRT>;

export type Range = [number, number] | undefined;

export const rangeTypes = {
  "Colour-Scaled": {
    type: Record({
      nbins: Number.Or(Undefined), // if undefined, use continous-colorscale
      colorAxis: ChannelIdxRT // typically Throttle Pos
    }),
    default: {
      nbins: 10,
      colorAxis: 
    }
  }
};
const ColorScaledBaseRT = Record({
  rangeType: Literal("Colour-Scaled"),
  nbins: Number.Or(Undefined), // if undefined, use continous-colorscale
  colorAxis: ChannelIdxRT // typically Throttle Pos
});
export const ColorScaledRT = ColorScaledBaseRT.Or(
  ColorScaledBaseRT.And(
    Record({
      yAxis: ChannelIdxRT
    })
  )
);
export type ColorScaled = Static<typeof ColorScaledRT>;
type ColorScaledWithYAxis = Static<typeof ColorScaledRT.alternatives[1]>;

const MultiChannelRT = Record({
  rangeType: Literal("Multi-Channel"),

  // outer array = y axis (can have multiple per plot)
  // inner array = different colours on same y axis
  yAxis: Array(Array(ChannelIdxRT))
});
export type MultiChannel = Static<typeof MultiChannelRT>;

// TODO if necessary: don't assume true
const isGeoJsonPolygon = (_poly: unknown): _poly is Polygon => true;

const TrackMapDomainRT = Record({
  domainType: Literal("Track-Map"),
  map: Record({
    inner: Unknown.withGuard(isGeoJsonPolygon),
    outer: Unknown.withGuard(isGeoJsonPolygon)
  }),
  segments: Number // maps are filled in in sections, can't be done otherwise
});
export type TrackMapDomain = Static<typeof TrackMapDomainRT>;
export type TrackMapSpec = TrackMapDomain & Static<typeof ColorScaledBaseRT>;

export const LineDomainXAxisRT = Union(Literal("Time"), Literal("Distance"));
const LineDomainRT = Record({
  domainType: Literal("Line"),
  xAxis: LineDomainXAxisRT
});
export type LineChartDomain = Static<typeof LineDomainRT>;
export type LineChartSpec = LineChartDomain &
  (ColorScaledWithYAxis | MultiChannel);

const ScatterDomainRT = Record({
  domainType: Literal("Scatter"),
  xAxis: ChannelIdxRT,
  trendline: Boolean
});
export type ScatterChartDomain = Static<typeof ScatterDomainRT>;
export type ScatterChartSpec = ScatterChartDomain &
  (ColorScaledWithYAxis | MultiChannel);

const HistogramDomainRT = Record({
  domainType: Literal("Histogram"),
  bins: Number
});
export type HistogramChartDomain = Static<typeof HistogramDomainRT>;
export type HistogramChartSpec = HistogramChartDomain &
  (ColorScaledWithYAxis | MultiChannel);

export const ChartSpecRT = TrackMapDomainRT.And(ColorScaledBaseRT).Or(
  Union(LineDomainRT, ScatterDomainRT, HistogramDomainRT).And(
    Union(ColorScaledRT, MultiChannelRT)
  )
);
export type ChartSpec = Static<typeof ChartSpecRT>;
