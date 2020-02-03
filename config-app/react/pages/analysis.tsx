import {
  Menu,
  Icon,
  Button,
  Row,
  Col,
  Avatar,
  Modal,
  Select,
  Breadcrumb
} from "antd";
import { Component } from "react";
import ModalAdd from "../components/Layout/Modal_Add_Group";
import AnalysisMenu from "../components/Layout/AnalysisMenu";
import SubHeader from "../components/Layout/SubHeader";
import Content from "../components/Layout/Content";
import "../css/home.css";
import Link from "next/link";

const WorkSheet = dynamic(() => import("../components/WorkSheet"), {
  ssr: false
});

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
            <SubHeader />
            <Content />
            <ModalAdd />
          </div>
        </div>
      </>
    );
  }
}
