import React, { Component } from "react";
import { Layout, Menu, Tooltip } from "antd";
const { Sider } = Layout;
const { SubMenu, Item } = Menu;
import {
  MailOutlined,
  PlusOutlined,
  ImportOutlined,
  CarOutlined,
} from "@ant-design/icons";

// This component isn't currently used. It was meant to be a general secondary sidebar for navigating subpages eg. Worksheets.
// AnalysisMenu was based off this.

class Explorer extends Component {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const Group: React.FC = ({ children, ...props }) => (
      <SubMenu
        style={{ margin: "0px" }}
        key={name}
        title={
          <span>
            <CarOutlined />
            <span>{name}</span>
          </span>
        }
        {...props}
      >
        {children}
      </SubMenu>
    );

    const SteeringItem = () => (
      <Item>
        <MailOutlined />
        <span>Steering</span>
      </Item>
    );

    return (
      <div style={{ width: "80px" }}>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            left: 0,
            backgroundColor: "#0F406A",
          }}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.toggleCollapsed}
        >
          <div
            style={{
              width: "100%",
              height: "40px",
              padding: "10px 24px",
              display: this.state.collapsed ? "none" : "",
            }}
          >
            <Tooltip title="Electrical Workbooks" placement="right">
              <h3
                style={{
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Electrical Workbooks
              </h3>
            </Tooltip>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["Driver"]}
            style={{ backgroundColor: "#0F406A" }}
          >
            <Group>
              <SteeringItem />
              <SteeringItem />
            </Group>
            <Group>
              <SteeringItem />
              <SteeringItem />
              <SteeringItem />
            </Group>
            <Item
              style={{
                position: "fixed",
                bottom: "88px",
                width: this.state.collapsed ? "80px" : "200px",
                margin: "0",
                marginLeft: "80px",
              }}
            >
              <ImportOutlined />
              <span>Import</span>
            </Item>

            <Item
              style={{
                position: "fixed",
                bottom: "48px",
                width: this.state.collapsed ? "80px" : "200px",
                margin: "0",
                marginLeft: "80px",
              }}
            >
              <PlusOutlined />
              <span>Create New Group</span>
            </Item>
          </Menu>
        </Sider>
      </div>
    );
  }
}

export default Explorer;
