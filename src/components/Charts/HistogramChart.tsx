import Unimplemented from "./Unimplemented";
import { ChartSpec } from "./AnyChart";
import { HistogramChartDomain } from "./Editors/Domain/HistogramDomainEditor";
import { MultiChannel } from "./Editors/Range/MultiChannelRangeEditor";

export type HistogramChartSpec = ChartSpec &
  HistogramChartDomain &
  MultiChannel;

export default Unimplemented("Chart/Histogram");
