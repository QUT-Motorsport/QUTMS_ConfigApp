export type ChannelIdx = number;

export type ColourScaledBase = {
  rangeType: "ColourScaled";
  nColourBins?: number; // if undefined, use continuous colour-scale
  colourAxis: ChannelIdx;
};

export type ColourScaledWithYAxis = ColourScaledBase & {
  yAxis: ChannelIdx;
};

export type ColourScaled = ColourScaledBase | ColourScaledWithYAxis;

export type MultiChannel = {
  rangeType: "MultiChannel";
  yAxes: ChannelIdx[][];
};

export type RangeTypesWithYAxis = ColourScaledWithYAxis | MultiChannel;
