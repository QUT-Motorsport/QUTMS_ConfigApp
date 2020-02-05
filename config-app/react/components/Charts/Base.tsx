import { QmsData } from "../../ts/qmsData";
import { ChartSpec, ChartSpecRT } from "../../ts/chartTypes";
import { ComponentType } from "react";

import Histogram from "./Histogram";
import Line from "./Line";
import Scatter from "./Scatter";
import TrackMap from "./TrackMap";

type ChartProps = {
  data: QmsData;
  spec: ChartSpec;
};

export default (props: ChartProps) => {
  const propped = (Component: ComponentType<ChartProps>) => (
    _spec?: any // ignore
  ) => <Component {...props} />;

  return ChartSpecRT.match(
    propped(TrackMap),

    // choose chart type based on domain
    ChartSpecRT.alternatives[1].intersectees[0].match(
      propped(Line),
      propped(Scatter),
      propped(Histogram)
    )
  )(props.spec);
};
