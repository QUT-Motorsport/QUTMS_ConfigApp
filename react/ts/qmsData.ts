import { useState, useEffect } from "react";
import interpolate from "everpolate";
import { get } from "./ajax";
import crossfilter from "crossfilter2";
import range from "./range";

// object acts as both the file interface and a cache for channel data
export type QmsData = {
  filename: string;
  // totalTime: number;
  // lapTimes: number[];
  channels: Channel[];

  // objects related to crossfiltering
  // null if no data downloaded yet
  crossfilter: null | QmsCrossfilter.Source;
};

namespace QmsCrossfilter {
  export type Entries = {
    // may contain channels that aren't currently in use if that channel was in use for a component
    // and then later unused; may change if memory requirements forbid this behaviour.
    [channelIdx: number]: number[];
  };

  export type Time = number;
  export type Record = {
    time: Time; // the timestep when this took place - used to index
  } & Entries;

  export type Dimension<
    T extends crossfilter.NaturallyOrderedValue
  > = crossfilter.Dimension<Record, T>;

  export type Source = {
    // the frequency at which records are currently listed.
    // Should always be the lowest of all channels being filtered.
    freq: number;

    // the crossfilter 'god object'
    index: crossfilter.Crossfilter<QmsCrossfilter.Record>;

    // crossfilter dimensions to be accessed by multiple components
    dimensions: {
      byTime: QmsCrossfilter.Dimension<QmsCrossfilter.Time>;
      byChannels: {
        [channelIdx: number]: QmsCrossfilter.Dimension<number>;
      };
    };
  };
}

export type Channel = {
  idx: number;
  name: string;
  freq: number;
  unit: string;
  data?: number[]; // undefined unless hydrated
};

export type ChannelGroup = {
  time: number[];

  channels: {
    channel: Channel;
    data: number[];
  }[];
};

export const useQmsData = (filename: string): QmsData | null => {
  const [qmsData, setQmsData] = useState<QmsData | null>(null);

  useEffect(() => {
    // todo: implement ts-deserializer
    get(`qms/${filename}`).then((data: Partial<QmsData>) => {
      data.channels!.forEach((channel: Channel, idx: number) => {
        channel.idx = idx;
      });

      setQmsData({
        ...data,
        channels: data.channels!,
        filename,
        crossfilter: null
      });
    });
  }, []);

  return qmsData;
};

const hydrateChannels = (
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

export const useChannelGroup = (
  data: QmsData,
  channelIdxs: number[]
): ChannelGroup | null => {
  const [channelGroup, setChannelGroup] = useState<ChannelGroup | null>(null);

  useEffect(() => {
    hydrateChannels(data, channelIdxs).then(() => {
      const channels = channelIdxs.map(idx => data.channels[idx]);

      const createCrossfilter = (
        channels: Channel[]
      ): QmsCrossfilter.Source => {
        const records = [];
        const minFreq = Math.min(...channels.map(({ freq }) => freq));
        const lowestFreqChannel = channels.find(
          ({ freq }) => freq === minFreq
        )!;

        for (let idx = 0; idx < lowestFreqChannel.data!.length; idx++) {
          const record: QmsCrossfilter.Record = {
            time: idx / minFreq
          };

          // add data to the record for all channels
          for (const channel of channels) {
            // how much more often this channel lists data compared to the minimum
            const freqRatio = channel.freq / minFreq;

            // add all the data points between this time and the next (at lower frequency) for this channel
            record[channel.idx] = channel.data!.slice(
              Math.round(idx * freqRatio),
              Math.round((idx + 1) * freqRatio)
            );
          }

          records.push(record);
        }

        const index = crossfilter(records);

        return {
          freq: minFreq,
          index,
          dimensions: {
            byTime: index.dimension(({ time }) => time),
            byChannels: {}
          }
        };
      };

      if (data.crossfilter === null) {
        // create the crossfilter for the first time
        data.crossfilter = createCrossfilter(channels);
      } else {
        // recreate the crossfilter with added channels
        data.crossfilter = createCrossfilter([
          // spread a set to keep the channels unique
          ...new Set([
            // get the channels from the crossfilter
            ...Object.keys(data.crossfilter.index.all()[0])
              .filter(key => key !== "time")
              .map(idxStr => data.channels[parseInt(idxStr)]),
            // and append it to the new channels
            ...channels
          ])
        ]);
      }

      // create the channel group skeleton
      const channelGroup: ChannelGroup = {
        time: [],
        channels: channels.map(channel => ({ channel, data: [] }))
      };

      const maxFreq = Math.max(...channels.map(({ freq }) => freq));

      // loop over the crossfilter records and interpolate the data
      const { index, freq: minFreq } = data.crossfilter;
      const records = index.all();

      records.forEach(record => {
        const recordTimes = range(
          record.time,
          record.time + 1 / minFreq,
          1 / maxFreq
        );
        channelGroup.time.push(...recordTimes);

        // perform step interpolation for lower frequency channels
        channels.forEach(({ freq, idx: channelIdx }, idx) => {
          const freqRatio = maxFreq / freq;
          for (const point of record[channelIdx]) {
            for (let repeatIdx = 0; repeatIdx < freqRatio; repeatIdx++) {
              channelGroup.channels[idx].data.push(point);
            }
          }
        });
      });

      setChannelGroup(channelGroup);
    });
  }, [channelIdxs]);

  return channelGroup;
};
