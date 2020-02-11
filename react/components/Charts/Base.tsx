import { QmsData } from "../../ts/qmsData";
import {
  ChartSpec,
  ChartSpecRT,
  TrackMapSpec,
  LineChartSpec,
  ScatterChartSpec,
  HistogramChartSpec,
  Range
} from "../../ts/chart/types";

import Histogram from "./Histogram";
import Line from "./Line";
import Scatter from "./Scatter";
import TrackMap from "./TrackMap";
import { StateHook } from "../../ts/hooks";

type ChartProps = {
  data: QmsData;
  spec: ChartSpec;
  domainState?: StateHook<Range>;
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
