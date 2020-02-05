import React, { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import { Row, Col, Avatar, Button, Drawer } from "antd";
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
    return (
      <div>
        <a onClick={this.showDrawer}>
          <Avatar size="large" icon="user" />
        </a>
        <Drawer
          title="User Information"
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
          width={600}
        >
          <br />
          <p>Email Address goes here</p> <br />
          <p>Change settings</p> <br />
          <p>Update account info</p> <br />
        </Drawer>
      </div>
    );
  }
}

export default UserInfo;
