import { useState, useEffect, useMemo } from "react";
import { get } from "./ajax";
import crossfilter from "crossfilter2";
import { Range, ChannelIdx } from "./chart/types";

// object acts as both the file interface and a cache for channel data
export type QmsData = {
  filename: string;

  // totalTime: number;
  // lapTimes: number[];
  channels: (ChannelHeader | Channel)[]; // just the header if un-hydrated

  // objects related to crossfiltering
  // null if no data downloaded yet
  crossfilter: null | Source;
};

export type Time = number;
export type Datum = number; // singular of data (a single point)
export type Data = Datum[];

export type Record = {
  time: Time;
  data: Map<Channel, Datum>;
};

export type DataDimension = crossfilter.Dimension<Record, Time>;

export type Filter = number | [number, number];

export type Source = {
  // the crossfilter 'god object'
  index: crossfilter.Crossfilter<Record>;

  // crossfilter dimensions to be accessed by multiple components
  dimensions: {
    byTime: crossfilter.Dimension<Record, Time>;
    byChannels: Map<Channel, DataDimension>;
  };
};

export type GroupIdx = crossfilter.NaturallyOrderedValue;

export type ChannelHeader = {
  idx: ChannelIdx;
  name: string;
  freq: number;
  unit: string;
};

export type Channel = ChannelHeader & {
  data: Data;
};

export type ChannelGroup = {
  time: Time[];
  channels: Map<Channel, Data>;
};

// used for grouping by eg, discrete color-scale, or track-map segment
export type GroupedChannelGroups = {
  // this is required (at least) for discrete color-scale colormap interpolation
  channelsMeta: Map<
    Channel,
    {
      min: Datum;
      max: Datum;
    }
  >;

  groups: Map<GroupIdx, ChannelGroup>;
};

export const useQmsData = (filename: string): QmsData | null => {
  const [qmsData, setQmsData] = useState<QmsData | null>(null);

  useEffect(() => {
    // todo: implement ts-deserializer
    get(`qms/${filename}`).then((data: QmsData) => {
      data.channels.forEach((channel: ChannelHeader, idx: number) => {
        channel.idx = idx;
      });

      setQmsData({
        ...data,
        channels: data.channels,
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
      if ("data" in channels[idx]) {
        (channels[idx] as Channel).data = await get(`qms/${filename}/${idx}`);
      }
    })
  );

export const useChannelGroup = (
  data: QmsData,
  args: {
    channelIdxs: number[];

    filters: {
      byTime?: Range;
      byChannels?: Map<Channel, Range>;
    };

    // if included, return array of channelgroup
    groupBy?: {
      channel: Channel;
      grouper: (val: number) => number; // return group index
    };
  }
): ChannelGroup | ChannelGroup[] | null => {
  const { channelIdxs, filters, groupBy } = args;

  const [channelGroup, setChannelGroup] = useState<
    ChannelGroup | ChannelGroup[] | null
  >(null);

  useMemo(() => {
    hydrateChannels(data, channelIdxs).then(() => {
      const channels = channelIdxs.map(idx => data.channels[idx]) as Channel[];

      if (data.crossfilter === null) {
        // create the crossfilter for the first time
        const index = crossfilter<Record>([]);
        data.crossfilter = {
          index,
          dimensions: {
            byTime: index.dimension(record => record.time),
            byChannels: new Map()
          }
        };
      }

      const {
        index,
        dimensions: { byTime, byChannels }
      } = data.crossfilter;

      // start with firstRecord, use later
      const firstRecord = index.all()[0] ?? {};

      const channelsMissing = channels.filter(
        channel => !(channel.idx in firstRecord)
      );

      if (channelsMissing.length > 0) {
        let prevRecord = firstRecord;
        // cache a lookup table time for use in the next bit
        let time2record = new Map<Time, Record>();
        for (const record of index.all()) {
          time2record.set(record.time, record);
        }
        // for each channel not yet in the crossfilter, add it to the lookup table
        for (const channel of channelsMissing) {
          channel.data!.forEach((val, idx) => {
            const time = idx / channel.freq;
            const existingRecord = time2record.get(time);
            for (const [channel, datum] of prevRecord.data.entries()) {
            }
            existingRecord.data;
            const updatedRecord = new Map([
              ...prevRecord,
              ...existingRecord,
              ["time", time],
              [channel.idx, val]
            ]);

            time2record.set(time, updatedRecord);
            prevRecord = updatedRecord;
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
              records[idx][channel.idx] = prevRecord.get(channel.idx);
            }
          }
          prevRecord = records[idx];
        });

        // reconstruct the crossfilter
        byTime.filterAll(); // clear the time filter - we're done with it
        index.remove();
        index.add(records);
      }

      if (channels.length > 0) {
        // apply all filters before preparing the channelgroup
        if (filters.byTime) {
          byTime.filter(filters.byTime);
        }
        if (filters.byChannels) {
          filters.byChannels.forEach((range, channel) => {
            if (!byChannels.has(channel)) {
              byChannels.set(
                channel,
                index.dimension(record => record.get(channel.idx)!)
              );
            }
            byChannels.get(channel)!.filter(range!);
          });
        }

        const createChannelGroup = (records: Record[]) => {
          const channelGroup: any = {
            time: [],
            channels: channels.map(channel => ({
              channel,
              data: []
            }))
          };
          // loop over the records and channels and construct the channel group
          for (const record of records) {
            channelGroup.time.push(record.get("time"));
            channels.forEach(({ idx: channelIdx }, idx) => {
              channelGroup.channels[idx].data.push(record.get(channelIdx));
            });
          }
          return channelGroup;
        };

        const mins = channels.map(channel => {
          let min = Number.MAX_VALUE;
          for (const num of channel.data!) {
            if (num < min) {
              min = num;
            }
          }
          return min;
        });

        const maxs = channels.map(channel => {
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
            .group<number, { [time: number]: Record }>(val => {
              const crossfilterChannelIdxs = channels.map(
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
    });
  }, [channelIdxs, filters, groupBy]);

  return channelGroup;
};
