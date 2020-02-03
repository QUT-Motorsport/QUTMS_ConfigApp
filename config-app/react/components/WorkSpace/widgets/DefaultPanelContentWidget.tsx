import { ReactNode } from "react";

export default ({ children }: { children: ReactNode }) => (
  <div
    style={{
      background: "rgba(0, 0, 0, 0.3)",
      padding: "10px",
      color: "rgba(255, 255, 255, 0.4)",
      fontSize: "13px",
      flexGrow: 1
    }}
  >
    {children}
  </div>
);
