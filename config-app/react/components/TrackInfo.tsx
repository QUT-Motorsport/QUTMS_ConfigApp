import React from "react";
import { Divider } from "antd";

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
      <b
        style={{
          padding: "0",
          color: "#0F406A",
          width: "100%",
          margin: "10px 0"
        }}
      >
        Location
      </b>
      <p>Queensland Raceway</p>

      <Weather />
    </div>
  );
};

export default TrackInfo;
