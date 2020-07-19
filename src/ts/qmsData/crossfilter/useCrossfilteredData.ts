import { useMemo, useEffect } from "react";

import { QmsData, Channel, Time, Data, ChannelHeader, Range } from "../types";
import {
  Crossfilter,
  GroupedChannelGroups,
  ChannelGroup,
  Record,
  GroupIdx,
} from "./types";
import useHydratedChannels from "../useHydratedChannels";
import { updateMinMax } from "../_helpers";
import { StateHook } from "../../hooks";

// variant that includes grouping
export default function useCrossfilteredData(
  data: QmsData,
  channelHeaders: ChannelHeader[],
  filterState: StateHook<Crossfilter>,
  groupBy: {
    channel: Channel;
    grouper: (val: number) => number; // return group index
  }
): GroupedChannelGroups | null;

// variant that doesn't include grouping
export default function useCrossfilteredData(
  data: QmsData,
  channelHeaders: ChannelHeader[],
  filterState: StateHook<Crossfilter>
): ChannelGroup | null;

// the actual implementation
export default function useCrossfilteredData(
  data: QmsData,
  channelHeaders: ChannelHeader[],

  filterState: StateHook<Crossfilter>,
  groupBy?: {
    channel: Channel;
    grouper: (val: number) => number; // return group index
  }
): ChannelGroup | GroupedChannelGroups | null {
  const channels = useHydratedChannels(data, channelHeaders);
  const [filter, setFilter] = filterState;

  const { filterUpdated, crossfilteredData } = useMemo(() => {
    let filterUpdated = false;
    const crossfilteredData = (() => {
      if (channels) {
        const index = filter.index;
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
              const existingRecord =
                time2record.get(time) ?? addNewRecord(time);
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
          const { byTime, byChannels } = filter.dimensions;
          const filters = filter.filters;

          // apply all filters before preparing the channelgroup
          if (filters.byTime) {
            byTime.filter(filters.byTime);
          }
          if (filters.byChannels) {
            filters.byChannels.forEach((range, channel) => {
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

          if (!groupBy) {
            // it's just a single group
            return createChannelGroup(index.allFiltered());
          } else {
            // TODO: cache the crossfilter group in the Crossfilter object for performance gains
            if (!byChannels.has(groupBy.channel)) {
              byChannels.set(
                groupBy.channel,
                index.dimension((record) => record.data.get(groupBy.channel)!)
              );
            }

            const timeRange: Range<Time> = [0, data.maxTime!];

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
                    Array.from(value.values()).sort((a, b) => a.time - b.time)
                  ),
                ])
              ),
            };
          }
        } else {
          return {
            time: [],
            channels: new Map(),
          };
        }
      } else {
        return null;
      }
    })();
    return { filterUpdated, crossfilteredData };
  }, [
    channels,
    // specify these 3 as separate dependencies so that the memo doesn't
    // retrigger of it's own update (from populating the index). Once this
    // step is completed as preprocessing in the backend we clear this up
    // (and remove the following useEffect entirely)
    filter,
    groupBy,
    data.maxTime,
  ]);

  useEffect(() => {
    if (filterUpdated) {
      setFilter({ ...filter });
    }
  }, [filterUpdated, filter, setFilter]);

  return crossfilteredData;
}
