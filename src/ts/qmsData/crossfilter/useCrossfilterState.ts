import { useState } from "react";
import crossfilter from "crossfilter2";
import { Crossfilter, Record } from "./types";

export default function useCrossfilterState() {
  const index = crossfilter<Record>([]);

  return useState<Crossfilter>({
    index,
    dimensions: {
      byTime: index.dimension((record) => record.time),
      byChannels: new Map(),
    },
    filters: {
      byChannels: new Map(),
    },
  });
}
