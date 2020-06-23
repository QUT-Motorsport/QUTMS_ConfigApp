import React from "react";
import Plot from "react-plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";
import iterate from "iterare";

import { ChannelIdx, RangeTypesWithYAxis } from "../../ts/chart/types";
import { StateHook } from "../../ts/hooks";
import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  yAxisName,
  axisTitle,
  baseChartSettings,
} from "../../ts/chart/helpers";
import { QmsData, useCrossfilteredData, Channel } from "../../ts/qmsData";
import { getChannels, useGroupByColorBins } from "./_helpers";
import { ChartSpec, ChartRange } from "./AnyChart";

export type ScatterChartDomain = {
  domainType: "Scatter";
  xAxis: ChannelIdx;
  showTrendline: Boolean;
};

export type ScatterChartSpec = ScatterChartDomain &
  RangeTypesWithYAxis &
  ChartSpec;

export default function ScatterChart({
  spec,
  data,
  domainState: [domain],
}: {
  spec: ScatterChartSpec;
  data: QmsData;
  domainState: StateHook<ChartRange>;
}) {
  // jet colour interpolator with internal cache
  const { discreteJetColors, groupBy } = useGroupByColorBins(data, spec);
  const [xRange, setXRange] = useState<Range>();
  const [yRange, setYRange] = useState<Range>();

  const crossfilterData = useCrossfilteredData(data, {
    channelIdxs: useMemo(() => [spec.xAxis, ...spec2ChannelIdxs(spec)], [spec]),
    filters: useMemo(() => ({ byTime: domain, byChannels: new Map() }), [
      domain,
    ]),
    groupBy,
  });

  if (crossfilterData === null) {
    return <Spin />;
  } else {
    const defaults = (yChannel: Channel) => ({
      type: "scattergl" as any,
      mode: "markers" as any,
      name: yChannel.name,
      yaxis: yAxisName(yChannel.idx)(spec),
    });

    const [xChannel] = getChannels(data, [spec.xAxis]);

    return (
      <Plot
        {...baseChartSettings}
        data={
          "groups" in crossfilterData // if we're using discrete color-scale
            ? iterate(crossfilterData.groups)
                .map(([groupIdx, channelGroup]) => {
                  if (
                    spec.rangeType === "Colour-Scaled" &&
                    spec.nColorBins !== null
                  ) {
                    const [yChannel] = getChannels(data, [spec.yAxis]);

                    const [min, max] = crossfilterData.groupedRange;

                    // repeat calls to this are cached
                    const { stop, color } = discreteJetColors(
                      min,
                      max,
                      spec.nColorBins!
                    )[groupIdx];

                    return {
                      ...defaults(yChannel),
                      x: channelGroup.channels.get(xChannel),
                      y: channelGroup.channels.get(yChannel),
                      name: `<= ${stop.toPrecision(3)}`,
                      marker: { color, symbol: "circle-open" },
                    };
                  } else {
                    // TODO: merge spec with channelGroup output so that this becomes a typeerror instead of a runtime error
                    throw new Error("Code path should never resolve");
                  }
                })
                .toArray()
                .reverse()
            : spec.rangeType === "Colour-Scaled"
            ? // continuous color-scale
              ((
                [yChannel, colorChannel] = getChannels(data, [
                  spec.yAxis,
                  spec.colorAxis,
                ])
              ) => [
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
                      },
                    },
                  },
                },
              ])()
            : getChannels(data, spec.yAxes.flat()).map((yChannel) => ({
                ...defaults(yChannel),
                x: crossfilterData.channels.get(xChannel),
                y: crossfilterData.channels.get(yChannel),
                // TODO: properly support multiple y axes here
                name: yChannel.name,
                marker: {
                  symbol: "circle-open",
                },
              }))
        }
        layout={{
          title: spec.title,
          autosize: true,
          ...yAxesLayout(
            yRange,
            data.channels[
              spec.rangeType === "Colour-Scaled" ? spec.yAxis : spec.yAxes[0][0]
            ] as Channel
          )(spec),
          xaxis: {
            title: axisTitle(data.channels[spec.xAxis] as Channel),
            range: xRange,
          },
          hovermode: "closest",
        }}
        onUpdate={getUpdateHandler([xRange, setXRange], [yRange, setYRange])}
      />
    );
  }
}
