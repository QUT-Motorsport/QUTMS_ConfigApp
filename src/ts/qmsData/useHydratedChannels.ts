import { useState, useEffect } from "react";
import { get } from "../ajax";
import { QmsData, Channel, ChannelHeader } from "./types";

import { initMinMax, updateMinMax } from "./_helpers";

// download and insert the data into the channels
export default function useHydratedChannels(
  data: QmsData,
  channels: ChannelHeader[]
) {
  const { filename } = data;
  const [hydrated, setHydrated] = useState<Channel[] | null>(null);

  useEffect(() => {
    Promise.all(
      channels.map(async ({ idx }) => {
        if (!("data" in data.channels[idx])) {
          const channel = data.channels[idx] as Channel;
          channel.data = await get(`qms/${filename}/${idx}`);

          channel.minMax = initMinMax();
          for (const datum of channel.data) {
            updateMinMax(channel.minMax, datum);
          }

          const channelFinishTime = channel.data.length / channel.freq;
          if (!data.maxTime || channelFinishTime > data.maxTime) {
            data.maxTime = channelFinishTime;
          }
        }
        return data.channels[idx] as Channel;
      })
    ).then(setHydrated);
  }, [channels, data.maxTime, filename, data.channels]);

  return hydrated;
}
