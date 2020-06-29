import Unimplemented from "./Unimplemented";
import { ChartSpec } from "./AnyChart";
import {
  DiscretelyColourScaled,
  ContinuouslyColourScaled,
} from "../../ts/chart/types";
import { Polygon } from "geojson";

export type TrackMapChartDomain = {
  domainType: "TrackMap";
  map: {
    inner: Polygon;
    outer: Polygon;
  };
  segments: Number;
};
export type TrackMapSpec = ChartSpec &
  TrackMapChartDomain &
  (DiscretelyColourScaled | ContinuouslyColourScaled);

export default Unimplemented("Chart/TrackMap");
