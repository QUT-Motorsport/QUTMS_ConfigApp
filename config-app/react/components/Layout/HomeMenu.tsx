import React, { Component } from "react";
import { Row, Col } from "antd";
import "../../styles/home.css";

class HomeMenu extends Component {
  render() {
    return (
      <>
        <Row>
          <Col md={{ span: 4 }} />
          <Col md={{ span: 5 }}>
            <h1>Start</h1>
            <a>
              <p>Open File...</p>
            </a>
            <a>
              <p>Import...</p>
            </a>
          </Col>
          <Col md={{ span: 5, offset: 1 }}>
            <h1>Recent</h1>
            <a>
              <p>Lakeside_2020_03_02.qms</p>
            </a>
            <a>
              <p>Lakeside_2020_01_01.qms</p>
            </a>
            <a>
              <p>More...</p>
            </a>
          </Col>
          <Col md={{ span: 9 }} />
        </Row>
        <Row>
          <Col md={{ span: 4 }} />
          <Col md={{ span: 5 }}>
            <a>
              <h1>Customise</h1>
            </a>
            <a>
              <p>MATLAB Engine</p>
            </a>
            <a>
              <p>Settings & Keybindings</p>
            </a>
            <a>
              <p>Change Theme</p>
            </a>
          </Col>
          <Col md={{ span: 5, offset: 1 }}>
            <a>
              <h1>Help</h1>
            </a>
            <a>
              <p>Get Started</p>
            </a>
            <a>
              <p>Data Analysis Information</p>
            </a>
            <a>
              <p>Export/Import Guide</p>
            </a>
          </Col>
          <Col md={{ span: 9 }} />
        </Row>
        <Row>
          <Col md={{ span: 4 }} />
          <Col md={{ span: 5 }}>
            <a>
              <h1>Simulation</h1>
            </a>
            <a>
              <p>Import...</p>
            </a>
            <a>
              <p>View...</p>
            </a>
          </Col>
          <Col md={{ span: 5, offset: 1 }}>
            <a>
              <h1>Contact</h1>
            </a>
            <a>
              <p>Website</p>
            </a>
            <a>
              <p>Facebook</p>
            </a>
            <a>
              <p>Twitter</p>
            </a>
          </Col>
          <Col md={{ span: 9 }} />
        </Row>
      </>
    );
  }
}

export default HomeMenu;
