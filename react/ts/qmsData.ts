import { useState, useEffect } from "react";
import { get } from "./ajax";
import crossfilter from "crossfilter2";
import { Range } from "./chart/types";

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
  export type Time = number;
  export type Record = {
    time: Time; // the timestep when this took place - used to index

    // the data
    // may contain channels that aren't currently in use if that channel was in use for a component
    // and then later unused; may change if memory requirements forbid this behaviour.
    [channelIdx: number]: number;
  };

  export type DataDimension = crossfilter.Dimension<Record, Time>;

  export type Filter = number | [number, number];

  export type Source = {
    frequency: number;

    // the crossfilter 'god object'
    index: crossfilter.Crossfilter<Record>;

    // crossfilter dimensions to be accessed by multiple components
    dimensions: {
      byTime: crossfilter.Dimension<Record, Time>;
      byChannels: {
        [channelIdx: number]: DataDimension;
      };
    };
  };

  export type GroupIdx = crossfilter.NaturallyOrderedValue;
}

export type Channel = {
  idx: number;
  name: string;
  freq: number;
  unit: string;
  data?: number[]; // undefined unless hydrated
};

export type ChannelGroup = {
  time: QmsCrossfilter.Time[];
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
  channelIdxs: number[],

  filters: {
    byTime: Range;
    byChannels: {
      [channelIdx: number]: Range;
    };
  }
): ChannelGroup | null => {
  const [channelGroup, setChannelGroup] = useState<ChannelGroup | null>(null);

  useEffect(() => {
    hydrateChannels(data, channelIdxs).then(() => {
      const channels = channelIdxs.map(idx => data.channels[idx]);

      if (data.crossfilter === null) {
        // create the crossfilter for the first time
        const index = crossfilter([]);
        data.crossfilter = {
          frequency: 0,
          index,
          dimensions: {
            byTime: index.dimension(({ time }) => time),
            byChannels: {}
          }
        };
      }

      const {
        index,
        dimensions: { byTime, byChannels }
      } = data.crossfilter;

      // cache a lookup table time for use in the next bit
      const time2record = (() => {
        let time2record: { [time: number]: QmsCrossfilter.Record } = {};
        for (const record of index.all()) {
          time2record[record.time] = record;
        }

        return time2record;
      })();
      let prevRecord = time2record[0] ?? {};

      // for each channel not yet in the crossfilter, add it to the lookup table
      const channelsMissing = channels.filter(
        channel => !(channel.idx in prevRecord)
      );
      for (const channel of channelsMissing) {
        channel.data!.forEach((val, idx) => {
          const time = idx / channel.freq;
          time2record[time] = {
            ...prevRecord,
            ...time2record[time],
            time,
            [channel.idx]: val
          };
          prevRecord = time2record[time];
        });
      }

      // convert the lookup table to an ordered array of records
      const records = Object.values(time2record).sort(
        (a, b) => a.time - b.time
      );

      // perform step interpolation for all lower frequency channels
      const maxFreq = Math.max(...channels.map(({ freq }) => freq));
      const channelsNeedingInterpolation = channelsMissing.filter(
        channel => channel.freq < maxFreq
      );
      prevRecord = records[0];
      records.forEach((_, idx) => {
        for (const channel of channelsNeedingInterpolation) {
          if (!(channel.idx in records[idx])) {
            records[idx][channel.idx] = prevRecord[channel.idx];
          }
        }
        prevRecord = records[idx];
      });

      // reconstruct the crossfilter
      byTime.filterAll(); // clear the time filter - we're done with it
      index.remove();
      index.add(records);

      // apply all filters before preparing the channelgroup
      if (filters.byTime !== undefined) {
        byTime.filter(filters.byTime);
      }
      Object.entries(filters.byChannels).forEach(([channelIdxStr, range]) => {
        const channelIdx = parseInt(channelIdxStr);
        if (byChannels[channelIdx] === undefined) {
          byChannels[channelIdx] = index.dimension(
            record => record[channelIdx]
          );
        }
        byChannels[channelIdx].filter(range!);
      });

      // loop over the records and channels and construct the channel group
      const channelGroup: ChannelGroup = {
        time: [],
        channels: channels.map(channel => ({ channel, data: [] }))
      };
      for (const record of index.allFiltered()) {
        channelGroup.time.push(record.time);
        channels.forEach(({ idx: channelIdx }, idx) => {
          channelGroup.channels[idx].data.push(record[channelIdx]);
        });
      }

      setChannelGroup(channelGroup);
    });
  }, [channelIdxs]);

  return channelGroup;
};
