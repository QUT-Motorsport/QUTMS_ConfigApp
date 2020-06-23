import Unimplemented from "./Unimplemented";
import { ChartSpec } from "./AnyChart";
import { RangeTypesWithYAxis } from "../../ts/chart/types";

export type HistogramChartDomain = {
  domainType: "Histogram";
  nBins: number;
};

export type HistogramChartSpec = HistogramChartDomain &
  RangeTypesWithYAxis &
  ChartSpec;

export default Unimplemented("Chart/Histogram");
