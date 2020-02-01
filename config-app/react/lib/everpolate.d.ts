// this adds types to a pure javascript module
declare module "everpolate" {
  type InterpolateFn = (
    x: number | number[],
    X: number[],
    Y: number[]
  ) => number[];

  export const step: InterpolateFn;

  export const linear: InterpolateFn;

  export const polynomial: InterpolateFn;
}
