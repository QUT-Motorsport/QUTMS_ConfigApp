import { Menu, Icon, Button } from "antd";
import { Component } from "react";

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
        <div className="something" style={{ width: 256, height: "1000px" }}>
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
          >
            <Menu.Item key="1" onClick={this.toggleCollapsed}>
              <Icon type="right" />
              <span>Workbooks</span>
            </Menu.Item>
            <SubMenu
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
          </Menu>
        </div>
      </>
    );
  }
}
