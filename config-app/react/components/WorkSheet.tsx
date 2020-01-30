import { QmsData } from "../ts/api";
import Plot from "react-plotly.js";
import { useEffect, useState, useRef, useMemo } from "react";
import { PlotData } from "plotly.js";
import { Spin } from "antd";

type ChartSpec = {
  mode: PlotData["mode"];
  channel_idxs: number[];
};

const useHydration = (
  data: QmsData,
  channel_idxs: ChartSpec["channel_idxs"]
) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(false);
    data.hydrate_channels(channel_idxs).then(() => setHydrated(true));
  }, [channel_idxs]);

  return hydrated;
};

type Range = [number, number] | undefined;

type ChartData = {
  data: QmsData;
  _hydrated?: boolean;
  range: Range;
  onNewRange: (range: Range) => void;
};

const GROUND_SPEED_CH_IDX = 44;
const TIMELINE_IDXS = [GROUND_SPEED_CH_IDX];

const Timeline = ({
  data,
  _hydrated: hydrated = useHydration(data, TIMELINE_IDXS),
  range,
  onNewRange
}: ChartData) =>
  hydrated ? (
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
      <Plot
        className="plotly-timeline"
        data={[
          {
            y: data.channels[GROUND_SPEED_CH_IDX].data,
            type: "scatter",
            mode: "lines"
          }
        ]}
        useResizeHandler={true}
        layout={{
          title: "",
          xaxis: {
            range,
            rangeslider: {}
          },
          yaxis: {
            fixedrange: true
          },
          autosize: true
        }}
        onRelayout={e => {
          const EVENT_NEWRANGE_ATTR = "xaxis.range";
          if (EVENT_NEWRANGE_ATTR in e) {
            onNewRange((e as any)[EVENT_NEWRANGE_ATTR]);
          }
        }}
        debug={true}
      />
    </div>
  ) : (
    <Spin />
  );

// const Chart = ({
//   mode,
//   channel_idxs,
//   data,
//   _hydrated: hydrated = useHydration(data, channel_idxs)
// }: ChartSpec & ChartData) =>
//   hydrated ? (
//     <Plot
//       data={channel_idxs.map(idx => ({
//         y: data.channels[idx].data,
//         type: "scatter",
//         mode
//       }))}
//       layout={{
//         title: channel_idxs.map(idx => data.channels[idx].name).join(" vs "),
//         xaxis: {
//           rangeslider: {}
//         },
//         yaxis: {
//           fixedrange: true
//         }
//       }}
//       onRelayout={e => {
//         console.log("RELAYOUT", e);
//       }}
//     />
//   ) : (
//     <Spin />
//   );
const useForceUpdate = () => {
  const [_value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
};

export default ({ data, charts }: { data: QmsData; charts: ChartSpec[] }) => {
  const range1 = useRef<Range>();
  const range2 = useRef<Range>();

  const forceUpdate = useForceUpdate();

  console.log(range1.current, range2.current);

  const timeline1 = useMemo(
    () => (
      <Timeline
        data={data}
        range={range1.current}
        onNewRange={range => {
          range2.current = range;
          forceUpdate();
        }}
      />
    ),
    [range1.current]
  );

  const timeline2 = useMemo(
    () => (
      <Timeline
        data={data}
        range={range2.current}
        onNewRange={range => {
          range1.current = range;
          forceUpdate();
        }}
      />
    ),
    [range2.current]
  );

  return (
    <>
      {timeline1}
      {timeline2}
    </>
  );
};
