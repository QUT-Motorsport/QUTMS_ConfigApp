import { useState, useEffect } from "react";
import interpolate from "everpolate";
import { get } from "./ajax";

// object acts as both the file interface and a cache for channel data
export type QmsData = {
  filename: string;
  totalTime: number;
  lapTimes: number[];
  channels: Channel[];
};

export type Channel = {
  idx: number;
  name: string;
  freq: number;
  unit: string;
  data?: number[]; // undefined unless hydrated
};

export type ChannelGroup = {
  x: number[];
  channels: {
    channel: Channel;
    y: number[];
  }[];
};

export const useQmsData = (filename: string): QmsData | null => {
  const [qmsData, setQmsData] = useState<QmsData | null>(null);

  useEffect(() => {
    (async () => {
      const data = await get(`qms/${filename}`);
      // add index data to channels for later use
      data.channels.forEach((channel: Channel, idx: number) => {
        channel.idx = idx;
      });
      setQmsData({
        ...data,
        filename
      });
    })();
  }, []);

  return qmsData;
};

export const useChannelGroup = (
  { filename, channels }: QmsData,
  channelIdxs: number[]
): ChannelGroup | null => {
  const [channelGroup, setChannelGroup] = useState<ChannelGroup | null>(null);

  useEffect(() => {
    if (channelIdxs.length > 0) {
      Promise.all(
        channelIdxs.map(async idx => {
          if (channels[idx].data === undefined) {
            channels[idx].data = await get(`qms/${filename}/${idx}`);
          }
        })
      ).then(() => {
        const groupChannels = channelIdxs.map(idx => channels[idx]);
        const maxFreq = Math.max(...groupChannels.map(({ freq }) => freq));
        const maxLen = Math.max(
          ...groupChannels.map(({ data }) => data!.length)
        );
        const x = [...Array(maxLen).keys()].map(idx => idx / maxFreq);

        setChannelGroup({
          x,
          channels: groupChannels.map(channel => ({
            channel,
            // the interpolation function used can be swapped out if need be. Right now use 'step',
            // which uses the last REAL recorded value at each timestep
            y: interpolate.step(
              x,
              [...Array(channel.data!.length).keys()].map(
                idx => idx / channel.freq
              ),
              channel.data!
            )
          }))
        });
      });
    } else {
      setChannelGroup({
        x: [],
        channels: []
      });
    }
  }, [channelIdxs]);

  return channelGroup;
};
