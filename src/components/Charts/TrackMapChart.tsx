import Unimplemented from "./Unimplemented";
import { ChartSpec } from "./AnyChart";
import {
  DiscretelyColourScaled,
  ContinuouslyColourScaled,
} from "./Editors/Range/ColorScaledRangeEditor";
import { TrackMapChartDomain } from "./Editors/Domain/TrackMapDomainEditor";

export type TrackMapChartSpec = ChartSpec &
  TrackMapChartDomain &
  (DiscretelyColourScaled | ContinuouslyColourScaled);

export default Unimplemented("Chart/TrackMap");
