import { useState, useEffect, useMemo } from "react";
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
    min: number;
    max: number;
  }[];
};

export const useQmsData = (filename: string): QmsData | null => {
  const [qmsData, setQmsData] = useState<QmsData | null>(null);

  useMemo(() => {
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
  args: {
    channelIdxs: number[];

    filters: {
      byTime?: Range;
      byChannels?: {
        [channelIdx: number]: Range;
      };
    };

    // if included, return array of channelgroup
    groupBy?: {
      channelIdx: number;
      grouper: (info: { min: number; max: number }) => (val: number) => number; // return group index
    };
  }
): ChannelGroup | ChannelGroup[] | null => {
  const { channelIdxs, filters, groupBy } = args;

  const [channelGroup, setChannelGroup] = useState<
    ChannelGroup | ChannelGroup[] | null
  >(null);
  const [crossfilterChannels, setCrossfilterChannels] = useState<Channel[]>([]);

  useMemo(() => {
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
        dimensions: { byTime }
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

      const channelsMissing = channels.filter(
        channel => !(channel.idx in prevRecord)
      );

      if (channelsMissing.length > 0) {
        // for each channel not yet in the crossfilter, add it to the lookup table
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
      }

      // trigger the other effect to update
      setCrossfilterChannels(channels);
    });
  }, [channelIdxs]);

  useMemo(() => {
    if (crossfilterChannels.length > 0) {
      const {
        index,
        dimensions: { byTime, byChannels }
      } = data.crossfilter!;

      // apply all filters before preparing the channelgroup
      if (filters.byTime !== undefined) {
        byTime.filter(filters.byTime);
      }
      if (filters.byChannels !== undefined) {
        Object.entries(filters.byChannels).forEach(([channelIdxStr, range]) => {
          const channelIdx = parseInt(channelIdxStr);
          if (byChannels[channelIdx] === undefined) {
            byChannels[channelIdx] = index.dimension(
              record => record[channelIdx]
            );
          }
          byChannels[channelIdx].filter(range!);
        });
      }

      const createChannelGroup = (records: QmsCrossfilter.Record[]) => {
        const channelGroup: any = {
          time: [],
          channels: crossfilterChannels.map(channel => ({
            channel,
            data: []
          }))
        };
        // loop over the records and channels and construct the channel group
        for (const record of records) {
          channelGroup.time.push(record.time);
          crossfilterChannels.forEach(({ idx: channelIdx }, idx) => {
            channelGroup.channels[idx].data.push(record[channelIdx]);
          });
        }
        return channelGroup;
      };

      const mins = crossfilterChannels.map(channel => {
        let min = Number.MAX_VALUE;
        for (const num of channel.data!) {
          if (num < min) {
            min = num;
          }
        }
        return min;
      });

      const maxs = crossfilterChannels.map(channel => {
        let max = Number.MIN_VALUE;
        for (const num of channel.data!) {
          if (num > max) {
            max = num;
          }
        }
        return max;
      });

      if (groupBy === undefined) {
        const channelGroup = createChannelGroup(index.allFiltered());
        channelGroup.channels.forEach(
          (channel: ChannelGroup["channels"][0], idx: number) => {
            channel.min = mins[idx];
            channel.max = maxs[idx];
          }
        );
        setChannelGroup(channelGroup);
      } else {
        if (byChannels[groupBy.channelIdx] === undefined) {
          byChannels[groupBy.channelIdx] = index.dimension(
            record => record[groupBy.channelIdx]
          );
        }

        const recordGroups = byChannels[groupBy.channelIdx]
          .group<number, { [time: number]: QmsCrossfilter.Record }>(val => {
            const crossfilterChannelIdxs = crossfilterChannels.map(
              channel => channel.idx
            );
            const groupByChannelIdx = crossfilterChannelIdxs.indexOf(
              groupBy.channelIdx
            );
            return groupBy.grouper({
              min: mins[groupByChannelIdx],
              max: maxs[groupByChannelIdx]
            })(val);
          })
          .reduce(
            // incremental reduce
            (group, record) => {
              // reduce-add
              group[record.time] = record;
              return group;
            },
            (group, record) => {
              // reduce-remove
              delete group[record.time];
              return group;
            },
            () => ({}) // reduce-init
          )
          .all();

        const channelGroups = recordGroups.map(recordGroup =>
          createChannelGroup(
            Object.values(recordGroup.value).sort((a, b) => a.time - b.time)
          )
        );

        for (const idx in channelGroups[0].channels) {
          for (const channelGroup of channelGroups) {
            channelGroup.channels[idx].min = mins[idx as any];
            channelGroup.channels[idx].max = maxs[idx as any];
          }
        }

        setChannelGroup(channelGroups);
      }

      // we're done. clear all filters.
      // byTime.filterAll();
      // Object.values(byChannels).forEach(dimension => dimension.filterAll());
    }
  }, [crossfilterChannels, filters, groupBy]);

  return channelGroup;
};
