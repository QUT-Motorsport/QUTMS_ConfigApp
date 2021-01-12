import "antd/dist/antd.css";

import React from "react";
import ReactDOM from "react-dom";
// import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/HeaderBar";
import SideBar from "./components/SideBar/SideBar";

function MenuWrapper({ children }: React.Props<null>) {
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
// serviceWorker.unregister();