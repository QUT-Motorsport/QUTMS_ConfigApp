import React from "react";
import { Layout, Menu } from "antd";
import SideBarItem from "./SideBarItem";

import {
  HomeOutlined,
  DashboardOutlined,
  HeatMapOutlined,
  SlidersOutlined,
  LineChartOutlined,
  BugOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

const SideBar = () => {
  return (
    <Sider
      width={80}
      style={{
        background: "#F2EFEA",
        boxShadow: "5px 2px 5px 0px rgba(0,0,0,0.25)",
        zIndex: 2,
      }}
    >
      <Menu
        mode="vertical"
        style={{
          background: "#F2EFEA",
          textAlign: "left",
          zIndex: 1,
          paddingTop: "5px",
        }}
      >
        <SideBarItem link="/home" name="Home" Icon={HomeOutlined} />
        <SideBarItem
          link="/telemetry"
          name="Telemetry"
          Icon={DashboardOutlined}
        />
        <SideBarItem link="/analysis" name="Analysis" Icon={HeatMapOutlined} />
        <SideBarItem
          link="/simulation"
          name="Simulation"
          Icon={LineChartOutlined}
        />
        <SideBarItem link="/config" name="Config" Icon={SlidersOutlined} />
        <SideBarItem link="/debug" name="CAN Debug" Icon={BugOutlined} />
      </Menu>
    </Sider>
  );
};

export default SideBar;
