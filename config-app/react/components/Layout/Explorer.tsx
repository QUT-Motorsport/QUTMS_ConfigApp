import React, { Component } from "react";
import ExplorerGroup from "./ExplorerGroup";
import ExplorerItem from "./ExplorerItem";
import { Layout, Menu, Icon } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import DividerBar from "../DividerBar";
const { Header, Content, Footer, Sider } = Layout;

class Explorer extends Component {
  state = {
    collapsed: false
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  //functions
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
