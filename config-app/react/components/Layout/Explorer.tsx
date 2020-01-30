import React, { Component } from "react";
import { Select, Button, Menu, Icon } from "antd";
import ExplorerGroup from "./ExplorerGroup";
import ExplorerItem from "./ExplorerItem";

const { SubMenu } = Menu;

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
      <Menu
        mode="inline"
        theme="light"
        inlineCollapsed={this.state.collapsed}
        className="explorer"
        style={{
          width: this.state.collapsed ? "" : "240px",
          height: "100vh",
          margin: "0px",
          padding: "0px",
          backgroundColor: "#0F406A",
          color: "#FFFFFF",
          border: "none"
        }}
      >
        <Menu.Item
          key="1"
          onClick={this.toggleCollapsed}
          style={{
            margin: "0px",
            backgroundColor: "#0D395E",
            border: "none",
            width: "100%"
          }}
        >
          <Icon type="right" />
          <span className="workbook">Default Workbook</span>
        </Menu.Item>

        <ExplorerGroup name="Test" iconType="mail">
          <ExplorerItem name="Testtttt" iconType="mail" {...this.props} />
          <ExplorerItem name="Testtttt" iconType="mail" {...this.props} />
          <ExplorerItem name="Testtttt" iconType="mail" {...this.props} />
          <ExplorerItem name="Testtttt" iconType="mail" {...this.props} />
        </ExplorerGroup>

        <ExplorerGroup name="Test" iconType="mail">
          <ExplorerItem name="Testtttt" iconType="mail" {...this.props} />
          <ExplorerItem name="Testtttt" iconType="mail" {...this.props} />
          <ExplorerItem name="Testtttt" iconType="mail" {...this.props} />
          <ExplorerItem name="Testtttt" iconType="mail" {...this.props} />
        </ExplorerGroup>
      </Menu>
    );
  }
}

export default Explorer;
