import { Range } from "./types";

export function initMinMax(): Range {
  return [Number.MAX_VALUE, Number.MIN_VALUE];
}

export function updateMinMax(range: Range, val: number) {
  if (val < range[0]) {
    range[0] = val;
  } else if (val > range[1]) {
    range[1] = val;
  }
}
