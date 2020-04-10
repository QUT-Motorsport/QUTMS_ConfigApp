import { QmsData, CrossFilters } from "../../ts/qmsData";
import {
  ChartSpec,
  ChartSpecRT,
  TrackMapSpec,
  LineChartSpec,
  ScatterChartSpec,
  HistogramChartSpec,
} from "../../ts/chart/types";

import Histogram from "./Histogram";
import Line from "./Line";
import Scatter from "./Scatter";
import TrackMap from "./TrackMap";
import { StateHook } from "../../ts/hooks";

type ChartProps = {
  data: QmsData;
  spec: ChartSpec;
  filtersState: StateHook<CrossFilters>;
  showDomainSlider?: boolean;
};

export default ({ spec, ...rest }: ChartProps) =>
  ChartSpecRT.match(
    () => <TrackMap spec={spec as TrackMapSpec} {...rest} />,

    // choose chart type based on domain
    ChartSpecRT.alternatives[1].intersectees[0].match(
      () => <Line spec={spec as LineChartSpec} {...rest} />,
      () => <Scatter spec={spec as ScatterChartSpec} {...rest} />,
      () => <Histogram spec={spec as HistogramChartSpec} {...rest} />
    )
  )(spec);
