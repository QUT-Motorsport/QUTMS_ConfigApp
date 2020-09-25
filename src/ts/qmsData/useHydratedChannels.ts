import { useState, useEffect } from "react";
import { get } from "../ajax";
import { QmsData, Channel, ChannelHeader } from "./types";

import { initMinMax, updateMinMax } from "./_helpers";

// download and insert the data into the channels
export default function useHydratedChannels(
  data: QmsData,
  required: ChannelHeader[]
) {
  const [hydrated, setHydrated] = useState<Channel[] | null>(null);

  useEffect(() => {
    const { filename, channels, maxTime } = data;
    Promise.all(
      required.map(async ({ idx }) => {
        if (!("data" in channels[idx])) {
          const channel = channels[idx] as Channel;
          channel.data = await get(`qms/${filename}/${idx}`);

          channel.minMax = initMinMax();
          for (const datum of channel.data) {
            updateMinMax(channel.minMax, datum);
          }
          //adjust max time to match the channel data length
          const channelFinishTime = channel.data.length / channel.freq;
          if (!maxTime || channelFinishTime > maxTime) {
            data.maxTime = channelFinishTime;
          }
        }
        return channels[idx] as Channel;
      })
    ).then(setHydrated);
  }, [required, data]);

  return hydrated;
}
