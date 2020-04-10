import { Icon } from "plotly.js";

declare module "plotly.js" {
  // missing from core definitions
  export const Icons: {
    [name: string]: Icon;
  };
}
