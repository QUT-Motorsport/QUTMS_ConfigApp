import { QmsData } from "../../ts/qmsData";
import {
  ChartSpec,
  ChartSpecRT,
  TrackMapSpec,
  LineChartSpec,
  ScatterChartSpec,
  HistogramChartSpec
} from "../../ts/chartTypes";

import Histogram from "./Histogram";
import Line from "./Line";
import Scatter from "./Scatter";
import TrackMap from "./TrackMap";

type ChartProps = {
  data: QmsData;
  spec: ChartSpec;
};

export default ({ data, spec }: ChartProps) => {
  return ChartSpecRT.match(
    () => <TrackMap data={data} spec={spec as TrackMapSpec} />,

    // choose chart type based on domain
    ChartSpecRT.alternatives[1].intersectees[0].match(
      () => <Line data={data} spec={spec as LineChartSpec} />,
      () => <Scatter data={data} spec={spec as ScatterChartSpec} />,
      () => <Histogram data={data} spec={spec as HistogramChartSpec} />
    )
  )(spec);
};
