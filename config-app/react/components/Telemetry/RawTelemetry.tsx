import React, { Component } from "react";
import { Table, Divider, Tag } from "antd";
import DividerBar from "../DividerBar";

class RawTelemetry extends Component {
  state = {}; // Will require state of what to include in table

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
        channel: "Brake Temp",
        reading: 50,
        unit: "C"
      },
      {
        key: "4",
        channel: "vCar",
        reading: 259.3,
        unit: "kph"
      }
    ];

    return (
      <div className="telemetry">
        <h3 style={{ marginTop: "10px", padding: "0", color: "#0F406A" }}>
          Raw Telemetry
        </h3>
        <DividerBar />

        <Table
          columns={columns}
          dataSource={data}
          size="small"
          pagination={false}
          style={{ marginTop: "10px" }}
        />
      </div>
    );
  }
}

export default RawTelemetry;
