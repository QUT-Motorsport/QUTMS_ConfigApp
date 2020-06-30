import { useMemo } from "react";
import crossfilter from "crossfilter2";
import iterate from "iterare";

import { QmsData, Channel, Time, Data, ChannelHeader } from "../types";
import {
  Crossfilter,
  GroupedChannelGroups,
  ChannelGroup,
  Record,
  GroupIdx,
} from "./types";
import useHydratedChannels from "../useHydratedChannels";
import { initMinMax, updateMinMax } from "../_helpers";

// variant that includes grouping
export default function useCrossfilteredData(
  data: QmsData,
  channelHeaders: ChannelHeader[],
  crossFilter: Crossfilter,
  groupBy: {
    channel: Channel;
    grouper: (val: number) => number; // return group index
  }
): GroupedChannelGroups | null;

// variant that doesn't include grouping
export default function useCrossfilteredData(
  data: QmsData,
  channelHeaders: ChannelHeader[],
  crossFilter: Crossfilter
): ChannelGroup | null;

// the actual implementation
export default function useCrossfilteredData(
  data: QmsData,
  channelHeaders: ChannelHeader[],

  crossFilter: Crossfilter,
  groupBy?: {
    channel: Channel;
    grouper: (val: number) => number; // return group index
  }
): ChannelGroup | GroupedChannelGroups | null {
  const channels = useHydratedChannels(data, channelHeaders);

  return useMemo(() => {
    if (channels) {
      // TODO: pre-process all data and store in the qms file format to save (dense time-series data)
      if (data.crossfilter === null) {
        // create the crossfilter for the first time
        const index = crossfilter<Record>([]);
        data.crossfilter = {
          index,
          dimensions: {
            byTime: index.dimension((record) => record.time),
            byChannels: new Map(),
          },
        };
      }

      const { index } = data.crossfilter;
      const firstRecord = index.all()[0] ?? { data: new Map() };
      const channelsMissing = channels.filter(
        (channel) => !firstRecord.data.has(channel)
      );

      // if new channels need to be added / computed
      if (channelsMissing.length > 0) {
        let prevRecord = firstRecord;
        // cache a lookup table time for use in the next bit
        let time2record = new Map<Time, Record>();
        for (const record of index.all()) {
          time2record.set(record.time, record);
        }
        // for each channel not yet in the crossfilter, add it to the lookup table
        const addNewRecord = (time: Time) => {
          const newRecord = { time, data: new Map(prevRecord.data) };
          time2record.set(time, newRecord);
          return newRecord;
        };

        for (const channel of channelsMissing) {
          for (let idx = 0; idx < channel.data.length; idx++) {
            const time = idx / channel.freq;
            const existingRecord = time2record.get(time) ?? addNewRecord(time);
            // step-interpolate lower frequency data
            for (const [channel, datum] of prevRecord.data.entries()) {
              if (!existingRecord.data.has(channel)) {
                existingRecord.data.set(channel, datum);
              }
            }
            // add the new data
            existingRecord.data.set(channel, channel.data[idx]);
            prevRecord = existingRecord;
          }
        }
        const records = [...time2record.values()].sort(
          (a, b) => a.time - b.time
        );

        // perform step interpolation for all lower frequency channels
        const maxFreq = Math.max(...channels.map(({ freq }) => freq));
        const channelsNeedingInterpolation = channelsMissing.filter(
          (channel) => channel.freq < maxFreq
        );
        prevRecord = firstRecord;
        for (let idx = 0; idx < records.length; idx++) {
          for (const channel of channelsNeedingInterpolation) {
            if (!records[idx].data.has(channel)) {
              records[idx].data.set(channel, prevRecord.data.get(channel)!);
            }
          }
          prevRecord = records[idx];
        }

        // reconstruct the crossfilter
        index.remove();
        index.add(records);
      }

      if (channels.length > 0) {
        const {
          dimensions: { byTime, byChannels },
        } = data.crossfilter;

        // apply all filters before preparing the channelgroup
        if (crossFilter.byTime) {
          byTime.filter(crossFilter.byTime);
        }
        if (crossFilter.byChannels) {
          crossFilter.byChannels.forEach((range, channel) => {
            if (!byChannels.has(channel)) {
              byChannels.set(
                channel,
                index.dimension((record) => record.data.get(channel)!)
              );
            }
            byChannels.get(channel)!.filter(range!);
          });
        }

        const createChannelGroup = (records: Record[]): ChannelGroup => {
          const time = [];
          const channelsData: Data[] = channels.map(() => []);

          // loop over the records and channels and construct the channel group
          for (const record of records) {
            time.push(record.time);
            for (let idx = 0; idx < channels.length; idx++) {
              channelsData[idx].push(record.data.get(channels[idx])!);
            }
          }
          return {
            time,
            channels: new Map(
              channels.map((channel, idx) => [channel, channelsData[idx]])
            ),
          };
        };

        if (groupBy === undefined) {
          // it's just a single group
          return createChannelGroup(index.allFiltered());
        } else {
          if (!byChannels.has(groupBy.channel)) {
            byChannels.set(
              groupBy.channel,
              index.dimension((record) => record.data.get(groupBy.channel)!)
            );
          }

          const timeRange = initMinMax();

          for (const record of index.allFiltered()) {
            updateMinMax(timeRange, record.time);
          }

          const recordGroups = byChannels
            .get(groupBy.channel)!
            .group<GroupIdx, Map<Time, Record>>(groupBy.grouper)
            .reduce(
              // incremental reduce
              (group, record) => {
                // reduce-add
                group.set(record.time, record);
                return group;
              },
              (group, record) => {
                // reduce-remove
                group.delete(record.time);
                return group;
              },
              () => new Map() // reduce-init
            )
            .all();

          return {
            timeRange,
            channels,
            groups: new Map(
              recordGroups.map(({ key, value }) => [
                key,
                createChannelGroup(
                  iterate(value.values())
                    .toArray()
                    .sort((a, b) => a.time - b.time)
                ),
              ])
            ),
          };
        }

        // we're done. clear all filters.
        // byTime.filterAll();
        // Object.values(byChannels).forEach(dimension => dimension.filterAll());
      } else {
        return {
          time: [],
          channels: new Map(),
        };
      }
    } else {
      return null;
    }
  }, [channels, crossFilter, data, groupBy]);
}
