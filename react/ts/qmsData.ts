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

const hydrateChannels = async (
  { filename, channels }: QmsData,
  channelIdxs: number[]
) =>
  Promise.all(
    channelIdxs.map(async idx => {
      if (channels[idx].data === undefined) {
        channels[idx].data = await get(`qms/${filename}/${idx}`);
      }
    })
  );

export const useChannels = (
  data: QmsData,
  channelIdxs: number[]
): Channel[] | null => {
  const [channels, setChannels] = useState<Channel[] | null>(null);

  useEffect(() => {
    hydrateChannels(data, channelIdxs).then(() => {
      setChannels(channelIdxs.map(idx => data.channels[idx]));
    });
  }, [channelIdxs]);

  return channels;
};

export const useChannelGroup = (
  data: QmsData,
  channelIdxs: number[]
): ChannelGroup | null => {
  const [channelGroup, setChannelGroup] = useState<ChannelGroup | null>(null);

  useEffect(() => {
    hydrateChannels(data, channelIdxs).then(() => {
      const groupChannels = channelIdxs.map(idx => data.channels[idx]);
      const maxFreq = Math.max(...groupChannels.map(({ freq }) => freq));
      const maxLen = Math.max(...groupChannels.map(({ data }) => data!.length));
      const x =
        maxLen !== undefined
          ? [...Array(maxLen).keys()].map(idx => idx / maxFreq)
          : [];

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
  }, [channelIdxs]);

  return channelGroup;
};
