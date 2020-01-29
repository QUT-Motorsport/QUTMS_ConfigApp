import { Menu, Icon, Button, Row, Col, Avatar } from "antd";
import { Component } from "react";
import "../css/home.css";
import Link from "next/link";

const { SubMenu } = Menu;

export default class App extends Component {
  state = {
    collapsed: false
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

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
          <div className="something" style={{ height: "1000px" }}>
            <Menu
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["driver", "suspension"]}
              mode="inline"
              theme="dark"
              inlineCollapsed={this.state.collapsed}
            >
              <Menu.Item key="1" onClick={this.toggleCollapsed}>
                <Icon type="right" />
                <span className="workbook">Default Workbook</span>
              </Menu.Item>

              <Menu.Item>
                <span
                  style={{
                    float: "right",
                    marginTop: "-10px",
                    paddingBottom: "10px",
                    color: "#EEE02C"
                  }}
                >
                  Import Dataset
                </span>
              </Menu.Item>

              <SubMenu
                key="driver"
                title={
                  <span>
                    <Icon type="mail" />
                    <span>Driver</span>
                  </span>
                }
              >
                <Menu.Item key="2">
                  <Icon type="user" />
                  <span>Steering</span>
                </Menu.Item>
                <Menu.Item key="3">
                  <Icon type="slider" />
                  <span>Braking</span>
                </Menu.Item>
                <Menu.Item key="4">
                  <Icon type="inbox" />
                  <span>Other</span>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="suspension"
                title={
                  <span>
                    <Icon type="mail" />
                    <span>Suspension</span>
                  </span>
                }
              >
                <Menu.Item key="5">
                  <Icon type="inbox" />
                  <span>Positions</span>
                </Menu.Item>
                <Menu.Item key="6">
                  <Icon type="inbox" />
                  <span>Velocities</span>
                </Menu.Item>
                <Menu.Item key="7">
                  <Icon type="inbox" />
                  <span>Histo</span>
                </Menu.Item>
              </SubMenu>
              <Menu.Item style={{ textAlign: "center" }}>
                <Icon type="plus" />
                <span>Create New Group</span>
              </Menu.Item>
            </Menu>
          </div>
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
              <div>content - graphs etc go here to fill page</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
