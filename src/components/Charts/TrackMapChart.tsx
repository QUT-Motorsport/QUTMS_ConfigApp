import Unimplemented from "./Unimplemented";
import { ChartSpec } from "./AnyChart";
import { ColorScaledBase } from "../../ts/chart/types";
import { Polygon } from "geojson";

export type TrackMapChartDomain = {
  domainType: "TrackMap";
  map: {
    inner: Polygon;
    outer: Polygon;
  };
  segments: Number;
};
export type TrackMapSpec = TrackMapChartDomain & ColorScaledBase & ChartSpec;

export default Unimplemented("Chart/TrackMap");
