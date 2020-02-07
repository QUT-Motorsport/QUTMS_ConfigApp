import React, { Component } from "react";
import { Select, Button, Modal, Avatar } from "antd";
import Link from "next/link";
import "../../styles/home.css";
import ModalSettings from "./ModalSettings";

// Optional sub header for pages - initially set up with the intention of putting breadcrumbs here + settings button
class SubHeader extends Component {
  render() {
    return (
      <div className="header-border">
        <a className="h1-alt" style={{ float: "left" }}>
          Analysis
        </a>
        <div>
          <ModalSettings />
        </div>
      </div>
    );
  }
}

export default SubHeader;
