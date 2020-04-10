import { Spin } from "antd";
import Plot from "react-plotly.js";
import { useState } from "react";

import { GROUND_SPEED_CH_IDX } from "../ts/chart/defaults";
import { QmsData, hydrateChannels, CrossFilters } from "../ts/qmsData";
import { StateHook } from "../ts/hooks";
import { anyChangeInRange, baseChartSettings } from "../ts/chart/helpers";

export default function Timeline({
  data,
  filtersState: [filters, setFilters],
}: {
  data: QmsData;
  filtersState: StateHook<CrossFilters>;
}) {
  const [groundSpeedChannel, setGroundSpeedChannel] = useState(
    data.channels[GROUND_SPEED_CH_IDX]
  );

  if (!("data" in groundSpeedChannel)) {
    hydrateChannels(data, [GROUND_SPEED_CH_IDX]).then(
      ([groundSpeedChannel]) => {
        console.log("setting channel", groundSpeedChannel);
        setGroundSpeedChannel({ ...groundSpeedChannel });
      }
    );
    return <Spin />;
  }

  // prepare the data for the linechart
  const time = [];
  const groundSpeedData = [];
  for (let idx = 0; idx < groundSpeedChannel.data.length; idx++) {
    time.push(idx / groundSpeedChannel.freq);
    groundSpeedData.push(groundSpeedChannel.data[idx]);
  }

  return (
    <div className="root">
      <style jsx>{`
        // TODO: Enable styled-jsx-postcss-plugin to DRY this up

        .root {
          width: 90%;
          margin-left: 5%;
          margin-right: 5%;
          margin-top: 10px;
          height: 40px;
          overflow: hidden;
        }

        .root > :global(.js-plotly-plot) {
          width: calc(100% + 153px) !important;
          height: 450px !important;
        }

        .root > :global(.js-plotly-plot) :global(.modebar) {
          display: none;
        }

        .root > :global(.js-plotly-plot) :global(.cartesianlayer) {
          display: none;
        }

        .root > :global(.js-plotly-plot) :global(.hoverlayer) {
          display: none;
        }

        .root > :global(.js-plotly-plot) :global(.draglayer) {
          display: none;
        }

        .root > :global(.js-plotly-plot) :global(.rangeslider-container) {
          transform: translate(3px, 0);
        }
      `}</style>
      <Plot
        {...baseChartSettings}
        data={[{ x: time, y: groundSpeedData }]}
        layout={{
          xaxis: {
            range: filters.show.byTime,
            rangeslider: {
              range: [0, data.maxTime],
            },
          },
        }}
        onUpdate={(
          {
            layout: {
              xaxis: { range },
            },
          }: any // Figure, with 100% defined xaxis and yaxis atts
        ) => {
          if (anyChangeInRange(filters.show.byTime, range)) {
            filters.show.byTime = range;
            setFilters({ ...filters });
          }
        }}
      />
    </div>
  );
}
