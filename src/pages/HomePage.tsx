import React from "react";
import { Row, Col } from "antd";
import { useTitle } from "./_helpers";

import styles from "./HomePage.module.scss";

export default function HomePage() {
  useTitle("QUTMS Home");

  function handleImportClick(e: any) {
    console.log("oof");
  }

  return (
    <div className={styles.homePage}>
      <Row>
        <Col md={{ span: 4 }} />
        <Col md={{ span: 5 }}>
          <h1>Start</h1>
          <button>
            <p>Open File...</p>
          </button>
          <button>
            <p>Import...</p>
          </button>
        </Col>
        <Col md={{ span: 5, offset: 1 }}>
          <h1>Recent</h1>
          <button>
            <p>Lakeside_2020_03_02.qms</p>
          </button>
          <button>
            <p>Lakeside_2020_01_01.qms</p>
          </button>
          <button>
            <p>More...</p>
          </button>
        </Col>
        <Col md={{ span: 9 }} />
      </Row>
      <Row>
        <Col md={{ span: 4 }} />
        <Col md={{ span: 5 }}>
          <button>
            <h1>Customise</h1>
          </button>
          <button>
            <p>MATLAB Engine</p>
          </button>
          <button>
            <p>Settings {"&"} Keybindings</p>
          </button>
          <button>
            <p>Change Theme</p>
          </button>
        </Col>
        <Col md={{ span: 5, offset: 1 }}>
          <button>
            <h1>Help</h1>
          </button>
          <button>
            <p>Get Started</p>
          </button>
          <button>
            <p>Data Analysis Information</p>
          </button>
          <button>
            <p>Export/Import Guide</p>
          </button>
        </Col>
        <Col md={{ span: 9 }} />
      </Row>
      <Row>
        <Col md={{ span: 4 }} />
        <Col md={{ span: 5 }}>
          <button>
            <h1>Simulation</h1>
          </button>
          <button onClick={handleImportClick}>
            <p>Import...</p>
          </button>
          <button>
            <p>View...</p>
          </button>
        </Col>
        <Col md={{ span: 5, offset: 1 }}>
          <button>
            <h1>Contact</h1>
          </button>
          <button>
            <p>Website</p>
          </button>
          <button>
            <p>Facebook</p>
          </button>
          <button>
            <p>Twitter</p>
          </button>
        </Col>
        <Col md={{ span: 9 }} />
      </Row>
    </div>
  );
}
