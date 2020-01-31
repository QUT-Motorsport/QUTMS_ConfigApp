import React, { Component } from "react";
import { Table, Divider, Tag } from "antd";

class RawTelemetry extends Component {
  render() {
    const columns = [
      {
        title: "Channel",
        dataIndex: "channel",
        key: "channel"
      },
      {
        title: "Reading",
        dataIndex: "reading",
        key: "reading"
      },
      {
        title: "Unit",
        key: "unit",
        dataIndex: "unit"
      }
    ];

    const data = [
      {
        key: "1",
        channel: "Longitudal Velocity",
        reading: 1,
        unit: "g"
      },
      {
        key: "2",
        channel: "Air Pressure",
        reading: 40,
        unit: "ppi"
      },
      {
        key: "3",
        channel: "Speed",
        reading: 32,
        unit: "km/h"
      }
    ];
    return (
      <div>
        <h3 style={{ marginTop: "40px", padding: "0", color: "#0F406A" }}>
          Raw Telemetry
        </h3>
        <Divider style={{ color: "#0F406A", margin: "0px 0" }} />
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          pagination={false}
          style={{ marginTop: "20px" }}
        />
      </div>
    );
  }
}

export default RawTelemetry;
