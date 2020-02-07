import React from "react";
import { Divider, Statistic } from "antd";

import Weather from "./Weather";
import DividerBar from "../DividerBar";

const TrackInfo = () => {
  return (
    <div style={{ marginTop: "5px" }}>
      <h3 style={{ padding: "0", color: "#0F406A" }}>Track Info</h3>
      <DividerBar />

      {/* Track Visualisation */}
      <img
        src="http://www.silhouet.com/motorsport/tracks/qrace2.gif"
        alt="Queensland Raceway Map"
        width="100%"
      />

      {/* Track Information */}
      <div style={{ marginTop: "10px", display: "flex", flexDirection: "row" }}>
        <Statistic
          valueStyle={{ color: "#0F406A" }}
          title="Location"
          value={"Queensland Raceway"}
          precision={2}
          style={{ fontWeight: 600 }}
        />
      </div>

      <Weather />
    </div>
  );
};

export default TrackInfo;
