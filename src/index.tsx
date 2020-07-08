/**
 * Will this show up in typedoc?
 */

import "antd/dist/antd.css";

import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";

import AnalysisPage from "./pages/AnalysisPage";
import LoginPage from "./pages/LoginPage";
import ConfigPage from "./pages/ConfigPage";
import GuestPage from "./pages/GuestPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import SimulationPage from "./pages/SimulationPage";
import TelemetryPage from "./pages/TelemetryPage";
import Header from "./components/Layout/HeaderBar";
import SideBar from "./components/Layout/SideBar/SideBar";

function MenuWrapper({ children }: React.Props<{}>) {
  return (
    <Layout
      id="whole"
      style={{
        height: "100vh",
      }}
    >
      <Header />
      <Layout>
        <SideBar />
        <Layout
          style={{
            background: "#fff",
            width: "100%",
          }}
        >
          <Layout.Content
            style={{
              overflow: "hidden",
            }}
          >
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

ReactDOM.render(
  // Can't use StrictMode because of an antd incompatability with current react version: https://github.com/ant-design/ant-design/issues/22493
  // <React.StrictMode>
  <BrowserRouter>
    <Switch>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/register">
        <RegisterPage />
      </Route>
      <Route path="/">
        <MenuWrapper>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/analysis">
            <AnalysisPage />
          </Route>
          <Route path="/config">
            <ConfigPage />
          </Route>
          <Route path="/guest">
            <GuestPage />
          </Route>
          <Route path="/simulation">
            <SimulationPage />
          </Route>
          <Route path="/telemetry">
            <TelemetryPage />
          </Route>
        </MenuWrapper>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
      </Route>
    </Switch>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
