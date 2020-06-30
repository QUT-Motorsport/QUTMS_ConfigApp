import React from "react";
import Plot, { PlotParams } from "react-plotly.js";
import { PlotData, Icons, ModeBarButton } from "plotly.js";
import { useMemo } from "react";
import { Spin } from "antd";
import iterate from "iterare";

import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  baseChartSettings,
  useCrossfilteredDataColourBinned,
  yAxisName,
} from "./_helpers";
import { QmsData, ChannelHeader } from "../../ts/qmsData/types";
import { Crossfilter } from "../../ts/qmsData/crossfilter/types";
import useCrossfilteredData from "../../ts/qmsData/crossfilter/useCrossfilteredData";
import { StateHook } from "../../ts/hooks";
import { ChartSpec } from "./AnyChart";
import { LineChartDomain } from "./Editors/Domain/LineDomainEditor";
import { MultiChannel } from "./Editors/Range/MultiChannelRangeEditor";
import {
  DiscretelyColourScaled,
  WithYAxis,
} from "./Editors/Range/ColorScaledRangeEditor";

export type LineChartSpec = ChartSpec &
  LineChartDomain &
  (MultiChannel | (DiscretelyColourScaled & WithYAxis));

function lineChartSettings(
  spec: LineChartSpec,
  yRangeChannel: ChannelHeader,
  [filter, setFilters]: StateHook<Crossfilter>
): Omit<PlotParams, "data"> {
  const yRange = filter.byChannels.get(yRangeChannel);
  return {
    layout: {
      title: spec.title,
      autosize: true,

      ...yAxesLayout(yRange, yRangeChannel, spec),

      xaxis: {
        title: spec.xAxis === "Time" ? "Time (s)" : "Distance (m)",
        range: filter.byTime?.slice(),
      },
    },
    config: {
      modeBarButtons: [
        ["select2d"],
        ["zoom2d", "pan2d", "autoScale2d"],
        [
          {
            name: "edit",
            title: "Edit Chart",
            icon: Icons["pencil"],
            click: () => {
              // TODO
              throw Error("Chart editing not implemented yet!");
            },
          },
        ],
      ] as ModeBarButton[][],
    },
    onUpdate: getUpdateHandler(
      filter.byTime,
      yRange,
      (newTimeRange, newYRange) => {
        filter.byTime = newTimeRange;
        if (newYRange) {
          filter.byChannels.set(yRangeChannel, newYRange);
        } else {
          filter.byChannels.delete(yRangeChannel);
        }
        setFilters({ ...filter });
      }
    ),
    onSelected: (selected) => {
      // TODO
      // filter.show.byChannels!.set();
      console.log(selected);
      // setSelected(selected?.range!.x as Range);
      // setSelected(selected?.range!.y as Range);
    },
    ...baseChartSettings,
  };
}

function DiscreteColourScaleLineChart({
  spec,
  data,
  filterState,
}: {
  spec: ChartSpec & LineChartDomain & DiscretelyColourScaled & WithYAxis;
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  const [filter] = filterState;
  const crossfilterData = useCrossfilteredDataColourBinned(data, spec, filter);

  if (!crossfilterData) {
    return <Spin />;
  } else {
    const { filtered, discreteJetColors } = crossfilterData;
    return (
      <Plot
        data={iterate(filtered.groups)
          .map(([groupIdx, channelGroup]) => {
            // repeat calls to this are cached
            const { stop, color } = discreteJetColors(spec.nColourBins!)[
              groupIdx
            ];

            // we need to let plotly know we don't want it to connect the gaps by inserting gaps into the data
            // in order to do this we need to reconstruct the signal, while inserting NULLS in where gaps should be
            const maxPeriodBeforGap =
              (function round( // round to account for floating point errors
                num = channelGroup.time[1] - channelGroup.time[0],
                decimals = 2
              ) {
                const coeff = Math.pow(10, decimals);
                return Math.round(coeff * num) / coeff;
              })() * 2; // mult by 2 because it takes 2 points to represent a line

            let prevTime = channelGroup.time[0];
            const x = [];
            const y = [];
            const data = channelGroup.channels.get(spec.yAxis)!;
            for (let idx = 0; idx < data.length; idx++) {
              const time = channelGroup.time[idx];
              if (time - prevTime > maxPeriodBeforGap) {
                x.push(time + maxPeriodBeforGap);
                y.push(null); // this tells plotly to put a gap in
              }
              x.push(time);
              y.push(data[idx]);
              prevTime = time;
            }

            return {
              x,
              y,
              name: `<= ${stop.toPrecision(3)}`,
              marker: { color, symbol: "circle-open" },
            };
          })
          .filter((trace) => trace !== null)
          .toArray()
          .reverse()}
        {...lineChartSettings(spec, spec.yAxis, filterState)}
      />
    );
  }
}

function MultiChannelLineChart({
  spec,
  data,
  filterState,
}: {
  spec: ChartSpec & LineChartDomain & MultiChannel;
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  const [filter] = filterState;
  const crossfilterData = useCrossfilteredData(
    data,
    useMemo(() => spec2ChannelIdxs(spec), [spec]),
    filter
  );

  return crossfilterData ? (
    <Plot
      data={iterate(crossfilterData.channels)
        .map(([channel, data]) => ({
          name: channel.name,
          x: crossfilterData.time,
          y: data,
          yaxis: yAxisName(channel, spec),
          mode: "lines" as "lines", // smh sometimes typescript
        }))
        .toArray()}
      {...lineChartSettings(spec, spec.yAxes[0][0], filterState)}
    />
  ) : (
    <Spin />
  );
}

export default function LineChart({
  spec,
  ...rest
}: {
  spec: LineChartSpec;
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  return spec.rangeType === "MultiChannel" ? (
    <MultiChannelLineChart spec={spec} {...rest} />
  ) : (
    <DiscreteColourScaleLineChart spec={spec} {...rest} />
  );
}
