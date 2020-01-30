import React, { Component } from "react";
import { Select, Button, Modal, Avatar } from "antd";
import Link from "next/link";
import "../../css/home.css";

class SubHeader extends Component {
  render() {
    return (
      <div className="header-border">
        <a className="h1-alt" style={{ float: "left" }}>
          Analysis
        </a>
        <Link href="">
          <a
            style={{
              float: "right",
              paddingTop: "15px",
              paddingRight: "0px"
            }}
          >
            <Avatar size="large" icon="setting" />
          </a>
        </Link>
      </div>
    );
  }
}

export default SubHeader;
