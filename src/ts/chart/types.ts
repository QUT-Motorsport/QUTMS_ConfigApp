export type ChannelIdx = number;

export type ColorScaledBase = {
  rangeType: "ColourScaled";
  nColorBins: number;
  colorAxis: ChannelIdx;
};

export type ColorScaledWithYAxis = ColorScaledBase & {
  yAxis: ChannelIdx;
};

export type ColorScaled = ColorScaledBase | ColorScaledWithYAxis;

export type MultiChannel = {
  rangeType: "MultiChannel";
  yAxes: ChannelIdx[][];
};

export type RangeTypesWithYAxis = ColorScaledWithYAxis | MultiChannel;
