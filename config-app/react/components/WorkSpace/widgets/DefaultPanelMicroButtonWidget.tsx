import * as React from "react";

export default ({ icon, selected }: { icon: string; selected: boolean }) => (
  <div
    style={{
      width: 45,
      height: 45,
      backgroundColor: "black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      ...(selected
        ? {
            backgroundColor: "rgb(0, 192, 255) !important",
            backgroundImage: `linear-gradient(
                rgba(black, 0),
                rgba(black, 0.2)
              ) !important`
          }
        : {})
    }}
  >
    {icon}
  </div>
);
