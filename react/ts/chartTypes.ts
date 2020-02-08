import {
  Union,
  Literal,
  Static,
  Number,
  Undefined,
  Array,
  Record,
  Boolean,
  Unknown,
  String
} from "runtypes";
import { Polygon } from "geojson";

const ChannelIdxRT = Number;

export type ChannelIdx = Static<typeof ChannelIdxRT>;

export type Range = [number, number] | undefined;

const ColorScaledBaseRT = Record({
  rangeType: Literal("Colour-Scaled"),
  nColorBins: Number.Or(Undefined), // if undefined, use continous-colorscale
  colorAxis: ChannelIdxRT // typically Throttle Pos
});
export type ColorScaledBase = Static<typeof ColorScaledBaseRT>;

const ColorScaledWithYAxisRT = ColorScaledBaseRT.And(
  Record({
    yAxis: ChannelIdxRT
  })
);
export type ColorScaledWithYAxis = Static<typeof ColorScaledWithYAxisRT>;

export const ColorScaledRT = ColorScaledBaseRT.Or(ColorScaledWithYAxisRT);
export type ColorScaled = Static<typeof ColorScaledRT>;

const MultiChannelRT = Record({
  rangeType: Literal("Multi-Channel"),

  // outer array = y axis (can have multiple per plot)
  // inner array = different colours on same y axis
  yAxes: Array(Array(ChannelIdxRT))
});
export type MultiChannel = Static<typeof MultiChannelRT>;

export const RangeTypesWithYAxisRT = Union(
  ColorScaledWithYAxisRT,
  MultiChannelRT
);
type RangeTypesWithYAxis = Static<typeof RangeTypesWithYAxisRT>;

// TODO if necessary: don't assume true
const isGeoJsonPolygon = (_poly: unknown): _poly is Polygon => true;

const DomainRT = Record({ title: String });
export type Domain = Static<typeof DomainRT>;

const TrackMapDomainRT = DomainRT.And(
  Record({
    domainType: Literal("Track-Map"),
    map: Record({
      inner: Unknown.withGuard(isGeoJsonPolygon),
      outer: Unknown.withGuard(isGeoJsonPolygon)
    }),
    segments: Number // maps are filled in in sections, can't be done otherwise
  })
);
export type TrackMapDomain = Static<typeof TrackMapDomainRT>;
export type TrackMapSpec = TrackMapDomain & Static<typeof ColorScaledBaseRT>;

export const LineDomainXAxisRT = Union(Literal("Time"), Literal("Distance"));
const LineDomainRT = DomainRT.And(
  Record({
    domainType: Literal("Line"),
    xAxis: LineDomainXAxisRT
  })
);
export type LineChartDomain = Static<typeof LineDomainRT>;
export type LineChartSpec = LineChartDomain & RangeTypesWithYAxis;

const ScatterDomainRT = DomainRT.And(
  Record({
    domainType: Literal("Scatter"),
    xAxis: ChannelIdxRT,
    trendline: Boolean
  })
);
export type ScatterChartDomain = Static<typeof ScatterDomainRT>;
export type ScatterChartSpec = ScatterChartDomain & RangeTypesWithYAxis;

const HistogramDomainRT = DomainRT.And(
  Record({
    domainType: Literal("Histogram"),
    nBins: Number
  })
);
export type HistogramChartDomain = Static<typeof HistogramDomainRT>;
export type HistogramChartSpec = HistogramChartDomain & RangeTypesWithYAxis;

// TODO: Separate domain and range types into generic types... How to do that with runtypes???
export const ChartSpecRT = TrackMapDomainRT.And(ColorScaledBaseRT).Or(
  Union(LineDomainRT, ScatterDomainRT, HistogramDomainRT).And(
    RangeTypesWithYAxisRT
  )
);
export type ChartSpec = Static<typeof ChartSpecRT>;
