import { Menu, Icon, Button } from "antd";
import { Component } from "react";
import PageExplorer from "../components/Layout/PageExplorer";

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
        <PageExplorer />
      </>
    );
  }
}
