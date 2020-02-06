import React, { Component } from "react";
import { Select, Button, Modal, Avatar } from "antd";
import Link from "next/link";
import "../../styles/home.css";
import Modal_3 from "./ModalSettings";

class SubHeader extends Component {
  render() {
    return (
      <div className="header-border">
        <a className="h1-alt" style={{ float: "left" }}>
          Analysis
        </a>
        <div>
          <Modal_3 />
        </div>
      </div>
    );
  }
}

export default SubHeader;
