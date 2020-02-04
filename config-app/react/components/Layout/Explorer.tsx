import React, { Component } from "react";
import ExplorerGroup from "./ExplorerGroup";
import ExplorerItem from "./ExplorerItem";
import { Layout, Menu, Icon } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
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
          </Menu>
        </Sider>
      </div>
    );
  }
}

export default Explorer;
