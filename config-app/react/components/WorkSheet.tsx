import Plot from "react-plotly.js";
import { useState } from "react";
import { Spin } from "antd";
import { StateHook, SetState } from "../ts/hooks";
import { QmsData, ChannelGroup, useChannelGroup } from "../ts/qmsData";

type ChartSpec = {
  channel_idxs: number[];
};

type Range = [number, number] | undefined;

type ChartProps = {
  data: QmsData;
  domainHook: StateHook<Range>;
  _rangeHook?: StateHook<Range>;
  _channelGroup?: ChannelGroup | null;
};

const GROUND_SPEED_CH_IDX = 44;
const TIMELINE_IDXS = [GROUND_SPEED_CH_IDX];

const reLayoutHandler = (
  setDomain: SetState<Range>,
  // some charts (timeline) don't care about range state because it's fixed
  setRange?: SetState<Range>
) => (e: any) => {
  [
    { name: "xaxis", set: setDomain },
    { name: "yaxis", set: setRange }
  ].forEach(({ name, set }) => {
    if (set !== undefined) {
      // axisChange events come in 3 consumable forms
      const event_newrange_attr = `${name}.range`;
      const event_newrange_attrs = [`${name}.range[0]`, `${name}.range[1]`];
      const event_resetrange_attr = `${name}.autorange`;

      if (event_newrange_attr in e) {
        set((e as any)[event_newrange_attr]);
      } else if (event_newrange_attrs.every(attr => attr in e)) {
        set(event_newrange_attrs.map(attr => (e as any)[attr]) as Range);
      } else if (event_resetrange_attr in e) {
        set(undefined); // if axis range == undefined, plotly sets it to 100%
      }
    }
  });
};

const Timeline = ({
  data,
  domainHook: [domain, setDomain],
  _channelGroup: channelGroup = useChannelGroup(data, TIMELINE_IDXS)
}: ChartProps) => (
  <div className="root">
    <style jsx>{`
      // TODO: Enable styled-jsx-postcss-plugin to DRY this up

      .root {
        width: 100%;
        height: 40px;
        overflow: hidden;
      }

      .root > :global(.plotly-timeline) {
        width: calc(100% + 153px);
        height: 450px;
      }

      .root > :global(.plotly-timeline) :global(.modebar) {
        display: none;
      }

      .root > :global(.plotly-timeline) :global(.cartesianlayer) {
        display: none;
      }

      .root > :global(.plotly-timeline) :global(.hoverlayer) {
        display: none;
      }

      .root > :global(.plotly-timeline) :global(.draglayer) {
        display: none;
      }

      .root > :global(.plotly-timeline) :global(.rangeslider-container) {
        transform: translate(3px, 0);
      }
    `}</style>
    {channelGroup ? (
      <Plot
        className="plotly-timeline"
        data={[
          {
            x: channelGroup.x,
            y: channelGroup.channels[0].y,
            mode: "lines"
          }
        ]}
        useResizeHandler={true}
        layout={{
          title: "",
          xaxis: {
            range: domain,
            rangeslider: {
              // KEEP THIS! Without it there's a weird bug when dragging
              range: [0, channelGroup.x[channelGroup.x.length - 1]]
            }
          },
          autosize: true
        }}
        onRelayout={reLayoutHandler(setDomain)}
      />
    ) : (
      <Spin />
    )}
  </div>
);

const Chart = ({
  channel_idxs,
  data,
  domainHook: [domain, setDomain],
  _rangeHook: [range, setRange] = useState(),
  _channelGroup: channelGroup = useChannelGroup(data, channel_idxs)
}: ChartSpec & ChartProps) =>
  channelGroup ? (
    <Plot
      data={channelGroup.channels.map(({ channel, y }) => ({
        name: channel.name,
        x: channelGroup.x,
        y: y,
        mode: "lines"
      }))}
      useResizeHandler={true}
      layout={{
        // title: channel_idxs.map(idx => data.channels[idx].name).join(" vs "),
        xaxis: { range: domain },
        yaxis: { range },
        autosize: true
      }}
      style={{
        width: "100%",
        height: "450px"
      }}
      onRelayout={reLayoutHandler(setDomain, setRange)}
    />
  ) : (
    <Spin />
  );

export default ({
  data,
  charts,
  _domainHook: domainHook = useState()
}: {
  data: QmsData;
  charts: ChartSpec[];
  _domainHook?: StateHook<Range>;
}) => (
  <>
    <Timeline data={data} domainHook={domainHook} />
    {charts.map(({ channel_idxs }, idx) => (
      <Chart
        key={idx}
        data={data}
        domainHook={domainHook}
        channel_idxs={channel_idxs}
      />
    ))}
  </>
);
