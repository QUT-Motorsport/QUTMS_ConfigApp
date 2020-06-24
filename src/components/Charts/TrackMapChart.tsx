import Unimplemented from "./Unimplemented";
import { ChartSpec } from "./AnyChart";
import { ColourScaledBase } from "../../ts/chart/types";
import { Polygon } from "geojson";

export type TrackMapChartDomain = {
  domainType: "TrackMap";
  map: {
    inner: Polygon;
    outer: Polygon;
  };
  segments: Number;
};
export type TrackMapSpec = TrackMapChartDomain & ColourScaledBase & ChartSpec;

export default Unimplemented("Chart/TrackMap");
