import React, { Component } from "react";
import ModalSettings from "./ModalSettings";

import styles from "./SubHeader.module.scss";

// Optional sub header for pages - initially set up with the intention of putting breadcrumbs here + settings button
class SubHeader extends Component {
  render() {
    return (
      <div className={styles.headerBorder}>
        <a className={styles.h1Alt} style={{ float: "left" }}>
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
