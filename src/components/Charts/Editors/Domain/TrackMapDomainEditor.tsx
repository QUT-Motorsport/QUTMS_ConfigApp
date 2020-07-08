import Unimplemented from "../../Unimplemented";
import { Polygon } from "geojson";

export type TrackMapChartDomain = {
  domainType: "TrackMap";
  map: {
    inner: Polygon;
    outer: Polygon;
  };
  segments: Number;
};

export default Unimplemented("Charts/Editors/Domain/TrackMap");
