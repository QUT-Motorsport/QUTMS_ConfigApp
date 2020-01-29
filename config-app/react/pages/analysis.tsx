import { Menu, Icon, Button, Row, Col, Avatar, Modal, Select } from "antd";
import { Component } from "react";
import PageExplorer from "../components/Layout/PageExplorer";
import AnalysisMenu from "../components/Layout/AnalysisMenu";

const { SubMenu } = Menu;
const { Option } = Select;

export default class App extends Component {
  render() {
    return (
      <>
        <AnalysisMenu />
      </>
    );
  }
}
