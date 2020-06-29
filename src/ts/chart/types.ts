export type ChannelIdx = number;

export type ContinuouslyColourScaled = {
  rangeType: "ColourScaled";
  colourAxis: ChannelIdx;
};

export type DiscretelyColourScaled = ContinuouslyColourScaled & {
  nColourBins: number;
};

export type WithYAxis = {
  yAxis: ChannelIdx;
};

export type ColourScaledWithYAxis = (
  | ContinuouslyColourScaled
  | DiscretelyColourScaled
) &
  WithYAxis;

export type ColourScaled = ContinuouslyColourScaled | ColourScaledWithYAxis;

export type MultiChannel = {
  rangeType: "MultiChannel";
  yAxes: ChannelIdx[][];
};

export type RangeTypesWithYAxis = ColourScaledWithYAxis | MultiChannel;
