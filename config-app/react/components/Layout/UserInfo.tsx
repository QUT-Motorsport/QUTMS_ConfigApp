import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import { Row, Col, Avatar, Button, Drawer, Dropdown, Menu } from "antd";
import "../../styles/home.css";

class UserInfo extends Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="#">Profile Settings</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="/">Logout</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <a>
            <Avatar size="large" icon="user" />
          </a>
        </Dropdown>
      </div>
    );
  }
}

export default UserInfo;
