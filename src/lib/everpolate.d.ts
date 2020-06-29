// Type definitions for everpolate 0.0
// Project: https://github.com/BorisChumichev/everpolate
// Definitions by: CallumJHays <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "everpolate" {
  type InterpolateFn = (
    x: number | number[],
    X: number[],
    Y: number[]
  ) => number[];

  export const linear: InterpolateFn;
  export const linearRegression: InterpolateFn;
  export const polynomial: InterpolateFn;
  export const step: InterpolateFn;
}
