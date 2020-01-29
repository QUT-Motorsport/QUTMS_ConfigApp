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
        <div className="something" style={{ width: 256 }}>
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
          >
            <Menu.Item key="1" onClick={this.toggleCollapsed}>
              <Icon type="right" />
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="user" />
              <span>Driver</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="slider" />
              <span>Suspension</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="inbox" />
              <span>Brakes</span>
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="inbox" />
              <span>Categories</span>
            </Menu.Item>
            <Menu.Item key="6">
              <Icon type="inbox" />
              <span>Temps</span>
            </Menu.Item>
            <Menu.Item key="7">
              <Icon type="inbox" />
              <span>Other</span>
            </Menu.Item>
          </Menu>
        </div>
      </>
    );
  }
}
