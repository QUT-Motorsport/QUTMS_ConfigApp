import React from "react";
import Plot from "react-plotly.js";
import { useMemo } from "react";
import { Spin } from "antd";
import iterate from "iterare";

import { ScatterChartDomain } from "./Editors/Domain/ScatterDomainEditor";
import { MultiChannel } from "./Editors/Range/MultiChannelRangeEditor";
import {
  DiscretelyColourScaled,
  WithYAxis,
  ContinuouslyColourScaled,
} from "./Editors/Range/ColorScaledRangeEditor";
import { StateHook } from "../../ts/hooks";
import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  yAxisName,
  axisTitle,
  baseChartSettings,
} from "./_helpers";
import { QmsData } from "../../ts/qmsData/types";
import { Crossfilter } from "../../ts/qmsData/crossfilter/types";
import useCrossfilteredData from "../../ts/qmsData/crossfilter/useCrossfilteredData";
import { useCrossfilteredDataColourBinned } from "./_helpers";
import { ChartSpec } from "./AnyChart";

export type ScatterChartSpec = ChartSpec &
  ScatterChartDomain &
  (
    | MultiChannel
    | ((ContinuouslyColourScaled | DiscretelyColourScaled) & WithYAxis)
  );

export default function ScatterChart({
  spec,
  ...rest
}: {
  spec: ScatterChartSpec;
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  return "nColourBins" in spec ? (
    <DiscreteColourScaleScatterChart spec={spec} {...rest} />
  ) : spec.rangeType === "MultiChannel" ? (
    <MultiChannelScatterChart spec={spec} {...rest} />
  ) : (
    <ContinuousColourScaleScatterChart spec={spec} {...rest} />
  );
}

function MultiChannelScatterChart({
  spec,
  data,
  filterState,
}: {
  spec: ChartSpec & ScatterChartDomain & MultiChannel;
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  const crossfilterData = useCrossfilteredData(
    data,
    useMemo(() => spec2ChannelIdxs(spec), [spec]),
    filterState
  );
  const defaults = plotDataDefaults(spec);

  if (crossfilterData) {
    return (
      <Plot
        {...scatterChartSettings(spec, filterState)}
        data={spec.yAxes.flat().map((yChannel) => ({
          ...defaults,
          x: crossfilterData.channels.get(spec.xAxis),
          y: crossfilterData.channels.get(yChannel),
          // TODO: properly support multiple y axes here
          name: yChannel.name,
          marker: {
            symbol: "circle-open",
          },
        }))}
      />
    );
  } else {
    return <Spin />;
  }
}

function ContinuousColourScaleScatterChart({
  spec,
  data,
  filterState,
}: {
  spec: ChartSpec & ScatterChartDomain & ContinuouslyColourScaled & WithYAxis;
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  const crossfilterData = useCrossfilteredData(
    data,
    useMemo(() => spec2ChannelIdxs(spec), [spec]),
    filterState
  );

  if (crossfilterData) {
    return (
      <Plot
        {...scatterChartSettings(spec, filterState)}
        data={[
          {
            ...plotDataDefaults(spec),
            x: crossfilterData.channels.get(spec.xAxis),
            y: crossfilterData.channels.get(spec.yAxis),

            marker: {
              symbol: "circle-open",
              color: crossfilterData.channels.get(spec.colourAxis),
              colorscale: "Jet",
              colorbar: {
                title: {
                  text: axisTitle(spec.colourAxis),
                  side: "right",
                } as any, // the types provided by plotly are incorrect here
              },
            },
          },
        ]}
      />
    );
  } else {
    return <Spin />;
  }
}

function DiscreteColourScaleScatterChart({
  spec,
  data,
  filterState,
}: {
  spec: ChartSpec & ScatterChartDomain & DiscretelyColourScaled & WithYAxis;
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  // jet colour interpolator with internal cache
  console.log("scatterChartUpdating");
  const crossfilterData = useCrossfilteredDataColourBinned(
    data,
    spec,
    filterState
  );

  if (crossfilterData) {
    const { filtered, discreteJetColors } = crossfilterData;

    const defaults = plotDataDefaults(spec);

    return (
      <Plot
        {...scatterChartSettings(spec, filterState)}
        data={iterate(filtered.groups)
          .map(([groupIdx, channelGroup]) => {
            // repeat calls to this are cached
            const { stop, color } = discreteJetColors(spec.nColourBins!)[
              groupIdx
            ];

            return {
              ...defaults,
              x: channelGroup.channels.get(spec.xAxis),
              y: channelGroup.channels.get(spec.yAxis),
              name: `<= ${stop.toPrecision(3)}`,
              marker: { color, symbol: "circle-open" },
            };
          })
          .toArray()
          .reverse()}
      />
    );
  } else {
    return <Spin />;
  }
}

function scatterChartSettings(
  spec: ScatterChartSpec,
  filterState: StateHook<Crossfilter>
) {
  const [{ filters }] = filterState;
  const xRange = filters.byChannels.get(spec.xAxis);
  // TODO: Support yaxes properly here
  const yChannel = "yAxis" in spec ? spec.yAxis : spec.yAxes[0][0];
  const yRange = filters.byChannels.get(yChannel);

  return {
    ...baseChartSettings,
    layout: {
      ...yAxesLayout(yRange, yChannel, spec),
      title: spec.title,
      autosize: true,
      xaxis: {
        title: axisTitle(spec.xAxis),
        range: xRange,
      },
      hovermode: "closest" as "closest",
    },
    onUpdate: getUpdateHandler(filterState, spec.xAxis, yChannel),
  };
}

function plotDataDefaults(spec: ScatterChartSpec) {
  const yChannel = "yAxis" in spec ? spec.yAxis : spec.yAxes[0][0];

  return {
    type: "scattergl" as any,
    mode: "markers" as any,
    name: yChannel.name,
    yaxis: yAxisName(yChannel, spec),
  };
}
