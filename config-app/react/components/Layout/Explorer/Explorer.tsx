import React, { Component } from "react";
import ExplorerGroup from "./ExplorerGroup";
import ExplorerItem from "./ExplorerItem";
import { Layout, Menu, Tooltip } from "antd";
const { Sider } = Layout;

// This component isn't currently used. It was meant to be a general secondary sidebar for navigating subpages eg. Worksheets.
// AnalysisMenu was based off this.

class Explorer extends Component {
  state = {
    collapsed: false
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <div style={{ width: "80px" }}>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            left: 0,
            backgroundColor: "#0F406A"
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
              display: this.state.collapsed ? "none" : ""
            }}
          >
            <Tooltip
              title="Electrical Workbookssssssssssssssssssssssssssssssssssssssssss"
              placement="right"
            >
              <h3
                style={{
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                Electrical Workbookssssssssssssssssssssssssssssssssssssssssss
              </h3>
            </Tooltip>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["Driver"]}
            style={{ backgroundColor: "#0F406A" }}
          >
            <ExplorerGroup name="Driver" iconType="car">
              <ExplorerItem name="Steering" iconType="mail" />
              <ExplorerItem name="Steering" iconType="mail" />
            </ExplorerGroup>
            <ExplorerGroup name="Driver" iconType="car">
              <ExplorerItem name="Steering" iconType="mail" />
              <ExplorerItem name="Steering" iconType="mail" />
              <ExplorerItem name="Steering" iconType="mail" />
            </ExplorerGroup>
            <ExplorerItem
              name="Import"
              iconType="import"
              style={{
                position: "fixed",
                bottom: "88px",
                width: this.state.collapsed ? "80px" : "200px",
                margin: "0",
                marginLeft: "80px"
              }}
            />
            <ExplorerItem
              name="Create New Group"
              iconType="plus"
              style={{
                position: "fixed",
                bottom: "48px",
                width: this.state.collapsed ? "80px" : "200px",
                margin: "0",
                marginLeft: "80px"
              }}
            />
          </Menu>
        </Sider>
      </div>
    );
  }
}

export default Explorer;
