import { Menu, Icon, Button, Row, Col, Avatar, Modal, Select } from "antd";
import { Component } from "react";
import ModalDefault from "../components/Layout/Modal_1";
import AnalysisMenu from "../components/Layout/AnalysisMenu";
import "../css/home.css";
import Link from "next/link";

const { SubMenu } = Menu;
const { Option } = Select;

export default class App extends Component {
  render() {
    return (
      <>
        <style jsx>{`
          .something {
            position: relative;
            left: 200;
          }
        `}</style>
        <div className="flex-container-menu">
          <AnalysisMenu />
          <div className="flex-container-analysis">
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
            <div className="analysis-content">
              <div>
                content - graphs etc go here to fill page, currently just one
                flexbox for all
              </div>
            </div>
            <ModalDefault />
          </div>
        </div>
      </>
    );
  }
}
