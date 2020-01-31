import React from "react";
import { Divider, Statistic } from "antd";

import Weather from "./Weather";

const TrackInfo = () => {
  return (
    <div>
      <h3 style={{ margin: "10px 0", padding: "0", color: "#0F406A" }}>
        Track Info
      </h3>
      <Divider style={{ color: "#0F406A", margin: "5px 0" }} />
      <img
        src="http://www.silhouet.com/motorsport/tracks/qrace2.gif"
        alt="Queensland Raceway Map"
        width="100%"
      />
      <div style={{ float: "left", width: "100%" }}>
        <Statistic
          style={{ color: "#0F406A !important", fontWeight: 600, opacity: 100 }}
          valueStyle={{ color: "#0F406A" }}
          title="Location"
          value={"Queensland Raceway"}
          precision={2}
        />
      </div>

      <Weather />
    </div>
  );
};

export default TrackInfo;
