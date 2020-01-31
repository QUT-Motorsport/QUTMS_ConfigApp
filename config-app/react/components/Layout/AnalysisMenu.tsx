import { Menu, Icon } from "antd";
import Modal_2 from "./Modal_Create_Group";
import { useState } from "react";
import { QmsData, StateHook } from "../../ts/hooks";

const { SubMenu } = Menu;

export default ({
  data,
  _collapsedHook: [collapsed, setCollapsed] = useState<boolean>(false)
}: {
  data: QmsData;
  _collapsedHook?: StateHook<boolean>;
}) => (
  <div className="something" style={{ height: "1000px" }}>
    <Menu
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["driver", "suspension"]}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
    >
      <Menu.Item key="1" onClick={() => setCollapsed(!collapsed)}>
        <Icon type="right" />
        <span className="workbook">Default Workbook</span>
      </Menu.Item>

      <Menu.Item>
        <span
          style={{
            float: "right",
            marginTop: "-10px",
            paddingBottom: "10px",
            color: "#EEE02C"
          }}
        >
          <Icon type="plus" />
          Import Dataset
        </span>
      </Menu.Item>

      <SubMenu
        key="driver"
        title={
          <span>
            <Icon type="mail" />
            <span>Driver</span>
            <span>
              <Icon
                type="more"
                style={{ float: "right", marginTop: "14px" }}
              ></Icon>
            </span>
          </span>
        }
      >
        <Menu.Item key="2">
          <Icon type="user" />
          <span>Steering</span>
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="slider" />
          <span>Braking</span>
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="inbox" />
          <span>Other</span>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        key="suspension"
        title={
          <span>
            <Icon type="mail" />
            <span>Suspension</span>
            <span>
              <Icon
                type="more"
                style={{ float: "right", marginTop: "14px" }}
              ></Icon>
            </span>
          </span>
        }
      >
        <Menu.Item key="5">
          <Icon type="inbox" />
          <span>Positions</span>
        </Menu.Item>
        <Menu.Item key="6">
          <Icon type="inbox" />
          <span>Velocities</span>
        </Menu.Item>
        <Menu.Item key="7">
          <Icon type="inbox" />
          <span>Histo</span>
        </Menu.Item>
      </SubMenu>
      <Menu.Item style={{ textAlign: "center" }}>
        <Modal_2 data={data} />
      </Menu.Item>
    </Menu>
  </div>
);
