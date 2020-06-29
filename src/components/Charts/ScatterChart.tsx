import React from "react";
import Plot from "react-plotly.js";
import { useMemo } from "react";
import { Spin } from "antd";
import iterate from "iterare";

import {
  ChannelIdx,
  RangeTypesWithYAxis,
  DiscretelyColourScaled,
  WithYAxis,
  MultiChannel,
  ContinuouslyColourScaled,
} from "../../ts/chart/types";
import { StateHook } from "../../ts/hooks";
import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  yAxisName,
  axisTitle,
  baseChartSettings,
} from "../../ts/chart/helpers";
import {
  QmsData,
  useCrossfilteredData,
  Channel,
  getChannels,
  CrossFilter,
} from "../../ts/qmsData";
import { useGroupByColorBins } from "./_helpers";
import { ChartSpec, ChartRange } from "./AnyChart";

export type ScatterChartDomain = {
  domainType: "Scatter";
  xAxis: ChannelIdx;
  showTrendline: Boolean;
};

export type ScatterChartSpec = ChartSpec &
  ScatterChartDomain &
  RangeTypesWithYAxis;

// function scatterChartSettings() {
//   return {
//     ...baseChartSettings,
//   };
// }

function MultiChannelScatterChart({
  spec,
  data,
  filterState: [filter, setFilter],
}: {
  spec: ChartSpec & ScatterChartDomain & MultiChannel;
  data: QmsData;
  filterState: StateHook<CrossFilter>;
}) {
  const crossfilterData = useCrossfilteredData(
    data,
    useMemo(() => spec2ChannelIdxs(spec), [spec]),
    filter
  );

  if (crossfilterData) {
    const defaults = (yChannel: Channel) => ({
      type: "scattergl" as any,
      mode: "markers" as any,
      name: yChannel.name,
      yaxis: yAxisName(yChannel.idx)(spec),
    });

    const [xChannel, yRangeChannel] = getChannels(data, [
      spec.xAxis,
      spec.yAxes[0][0],
    ]);
    const xRange = filter.byChannels.get(xChannel);
    const yRange = filter.byChannels.get(yRangeChannel);

    return (
      <Plot
        {...baseChartSettings}
        data={getChannels(data, spec.yAxes.flat()).map((yChannel) => ({
          ...defaults(yChannel),
          x: crossfilterData.channels.get(xChannel),
          y: crossfilterData.channels.get(yChannel),
          // TODO: properly support multiple y axes here
          name: yChannel.name,
          marker: {
            symbol: "circle-open",
          },
        }))}
        layout={{
          title: spec.title,
          autosize: true,
          ...yAxesLayout(
            yRange,
            data.channels[spec.yAxes[0][0]] as Channel,
            spec
          ),
          xaxis: {
            title: axisTitle(getChannels(data, [spec.xAxis])[0]),
            range: filter.byChannels.get(xChannel),
          },
          hovermode: "closest",
        }}
        onUpdate={getUpdateHandler(xRange, yRange, (newXRange, newYRange) => {
          function updateShowFilters(channel: Channel, newRange: ChartRange) {
            if (newRange) {
              filter.byChannels.set(channel, newRange);
            } else {
              filter.byChannels.delete(channel);
            }
          }
          updateShowFilters(xChannel, newXRange);
          updateShowFilters(yRangeChannel, newYRange);
          if (newXRange) {
          }
          filter.byTime = newXRange;
          if (newYRange) {
            filter.byChannels.set(yRangeChannel, newYRange);
          } else {
            filter.byChannels.delete(yRangeChannel);
          }
          setFilter({ ...filter });
        })}
      />
    );
  } else {
    return <Spin />;
  }
}

function ContinuousColourScaleScatterChart({
  spec,
  data,
  filterState: [filter, setFilter],
}: {
  spec: ChartSpec & ScatterChartDomain & ContinuouslyColourScaled & WithYAxis;
  data: QmsData;
  filterState: StateHook<CrossFilter>;
}) {
  const crossfilterData = useCrossfilteredData(
    data,
    useMemo(() => spec2ChannelIdxs(spec), [spec]),
    filter
  );

  if (crossfilterData) {
    const defaults = (yChannel: Channel) => ({
      type: "scattergl" as any,
      mode: "markers" as any,
      name: yChannel.name,
      yaxis: yAxisName(yChannel.idx)(spec),
    });

    const [xChannel, yChannel, colorChannel] = getChannels(data, [
      spec.xAxis,
      spec.yAxis,
      spec.colourAxis,
    ]);
    const xRange = filter.byChannels.get(xChannel);
    const yRange = filter.byChannels.get(yChannel);

    return (
      <Plot
        {...baseChartSettings}
        data={[
          {
            ...defaults(yChannel),
            x: crossfilterData.channels.get(xChannel),
            y: crossfilterData.channels.get(yChannel),

            marker: {
              symbol: "circle-open",
              color: crossfilterData.channels.get(colorChannel),
              colorscale: "Jet",
              colorbar: {
                title: {
                  text: axisTitle(colorChannel),
                  side: "right",
                } as any,
              },
            },
          },
        ]}
        layout={{
          title: spec.title,
          autosize: true,
          ...yAxesLayout(yRange, data.channels[spec.yAxis] as Channel, spec),
          xaxis: {
            title: axisTitle(getChannels(data, [spec.xAxis])[0]),
            range: filter.byChannels.get(xChannel),
          },
          hovermode: "closest",
        }}
        onUpdate={getUpdateHandler(xRange, yRange, (newXRange, newYRange) => {
          function updateShowFilter(channel: Channel, newRange: ChartRange) {
            if (newRange) {
              filter.byChannels.set(channel, newRange);
            } else {
              filter.byChannels.delete(channel);
            }
          }
          updateShowFilter(xChannel, newXRange);
          updateShowFilter(yChannel, newYRange);
          if (newXRange) {
          }
          filter.byTime = newXRange;
          if (newYRange) {
            filter.byChannels.set(yChannel, newYRange);
          } else {
            filter.byChannels.delete(yChannel);
          }
          setFilter({ ...filter });
        })}
      />
    );
  } else {
    return <Spin />;
  }
}

function DiscreteColourScaleScatterChart({
  spec,
  data,
  filterState: [filter, setFilter],
}: {
  spec: ChartSpec & ScatterChartDomain & DiscretelyColourScaled & WithYAxis;
  data: QmsData;
  filterState: StateHook<CrossFilter>;
}) {
  // jet colour interpolator with internal cache
  const { discreteJetColors, groupBy } = useGroupByColorBins(data, spec);

  const crossfilterData = useCrossfilteredData(
    data,
    useMemo(() => spec2ChannelIdxs(spec), [spec]),
    filter,
    groupBy
  );

  debugger;

  if (crossfilterData) {
    const defaults = (yChannel: Channel) => ({
      type: "scattergl" as any,
      mode: "markers" as any,
      name: yChannel.name,
      yaxis: yAxisName(yChannel.idx)(spec),
    });

    const [xChannel, yRangeChannel] = getChannels(data, [
      spec.xAxis,
      spec.yAxis,
    ]);
    const xRange = filter.byChannels.get(xChannel);
    const yRange = filter.byChannels.get(yRangeChannel);

    return (
      <Plot
        {...baseChartSettings}
        data={iterate(crossfilterData.groups)
          .map(([groupIdx, channelGroup]) => {
            const [yChannel] = getChannels(data, [spec.yAxis]);
            // repeat calls to this are cached

            const { stop, color } = discreteJetColors(spec.nColourBins!)[
              groupIdx
            ];

            return {
              ...defaults(yChannel),
              x: channelGroup.channels.get(xChannel),
              y: channelGroup.channels.get(yChannel),
              name: `<= ${stop.toPrecision(3)}`,
              marker: { color, symbol: "circle-open" },
            };
          })
          .toArray()
          .reverse()}
        layout={{
          title: spec.title,
          autosize: true,
          ...yAxesLayout(yRange, data.channels[spec.yAxis] as Channel, spec),
          xaxis: {
            title: axisTitle(getChannels(data, [spec.xAxis])[0]),
            range: filter.byChannels.get(xChannel),
          },
          hovermode: "closest",
        }}
        onUpdate={getUpdateHandler(xRange, yRange, (newXRange, newYRange) => {
          function updateShowFilters(channel: Channel, newRange: ChartRange) {
            if (newRange) {
              filter.byChannels.set(channel, newRange);
            } else {
              filter.byChannels.delete(channel);
            }
          }
          updateShowFilters(xChannel, newXRange);
          updateShowFilters(yRangeChannel, newYRange);
          if (newXRange) {
          }
          filter.byTime = newXRange;
          if (newYRange) {
            filter.byChannels.set(yRangeChannel, newYRange);
          } else {
            filter.byChannels.delete(yRangeChannel);
          }
          setFilter({ ...filter });
        })}
      />
    );
  } else {
    return <Spin />;
  }
}

export default function ScatterChart({
  spec,
  ...rest
}: {
  spec: ScatterChartSpec;
  data: QmsData;
  filterState: StateHook<CrossFilter>;
}) {
  return "nColourBins" in spec ? (
    <DiscreteColourScaleScatterChart spec={spec} {...rest} />
  ) : spec.rangeType === "MultiChannel" ? (
    <MultiChannelScatterChart spec={spec} {...rest} />
  ) : (
    <ContinuousColourScaleScatterChart spec={spec} {...rest} />
  );
}
