import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { StateHook, QmsData } from "../ts/hooks";
// import { PlotData } from "plotly.js";
// import WorkSpace from "./WorkSpace";

type ChartSpec = {
  // mode: PlotData["mode"];
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
  rangeHook?: StateHook<Range>;
  _hydrated?: boolean;
};

const GROUND_SPEED_CH_IDX = 44;
const TIMELINE_IDXS = [GROUND_SPEED_CH_IDX];

const reLayoutHandler = (setRange: Dispatch<SetStateAction<Range>>) => (
  e: any
) => {
  // rangeChange events come in 2 consumable forms
  const EVENT_NEWRANGE_ATTR = "xaxis.range";
  const EVENT_NEWRANGE_ATTRS = ["xaxis.range[0]", "xaxis.range[1]"];

  if (EVENT_NEWRANGE_ATTR in e) {
    setRange((e as any)[EVENT_NEWRANGE_ATTR]);
  } else if (EVENT_NEWRANGE_ATTRS.every(attr => attr in e)) {
    setRange(EVENT_NEWRANGE_ATTRS.map(attr => (e as any)[attr]) as Range);
  }
};

const Timeline = ({
  data,
  rangeHook: [range, setRange] = useState(),
  _hydrated: hydrated = useHydration(data, TIMELINE_IDXS)
}: ChartData) => (
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
    {hydrated ? (
      ((
        { freq, data: y } = data.channels[GROUND_SPEED_CH_IDX],
        x = [...Array(y!.length).keys()].map(idx => idx / freq)
      ) => (
        <Plot
          className="plotly-timeline"
          data={[{ y, mode: "lines" }]}
          useResizeHandler={true}
          layout={{
            title: "",
            xaxis: {
              range,
              rangeslider: {
                // KEEP THIS! Without it there's a weird bug
                range: [0, x[x.length - 1]]
              }
            },
            yaxis: {
              fixedrange: true
            },
            autosize: true
          }}
          onRelayout={reLayoutHandler(setRange)}
        />
      ))()
    ) : (
      <Spin />
    )}
  </div>
);

const Chart = ({
  channel_idxs,
  data,
  rangeHook: [range, setRange] = useState(),
  _hydrated: hydrated = useHydration(data, channel_idxs)
}: ChartSpec & ChartData) =>
  hydrated ? (
    <Plot
      data={channel_idxs.map(idx => {
        const { name, freq, data: y } = data.channels[idx];
        return {
          name,
          mode: "lines",
          x: [...Array(y!.length).keys()].map(idx => idx / freq),
          y
        };
      })}
      useResizeHandler={true}
      layout={{
        title: channel_idxs.map(idx => data.channels[idx].name).join(" vs "),
        xaxis: {
          range
        },
        yaxis: {
          fixedrange: true
        },
        autosize: true
      }}
      style={{
        width: "100%",
        height: "450px"
      }}
      onRelayout={reLayoutHandler(setRange)}
    />
  ) : (
    <Spin />
  );

export default ({
  data,
  charts,
  _rangeHook: rangeHook = useState()
}: {
  data: QmsData;
  charts: ChartSpec[];
  _rangeHook?: StateHook<Range>;
}) => (
  <>
    <Timeline data={data} rangeHook={rangeHook} />
    {charts.map(({ channel_idxs }, idx) => (
      <Chart
        key={idx}
        data={data}
        rangeHook={rangeHook}
        channel_idxs={channel_idxs}
      />
    ))}
  </>
);
