import "antd/dist/antd.css";

import { ComponentType, ComponentProps } from "react";
import { Layout } from "antd";
import Header from "../components/Layout/Header";
import SideBar from "../components/Layout/SideBar";

const { Content } = Layout;

export default <Page extends ComponentType<any>>({
  Component,
  pageProps
}: {
  Component: Page;
  pageProps: ComponentProps<Page>;
}) =>
  typeof window !== "undefined" &&
  (window.location.href.endsWith("/") ||
    window.location.href.endsWith("/register")) ? (
    <Component {...pageProps} />
  ) : (
    <Layout
      id="whole"
      style={{
        width: "100%",
        height: "100vh"
      }}
    >
      <Header />
      <Layout
        style={{
          background: "#fff",
          width: "100%"
        }}
      >
        <SideBar />
        <Layout
          style={{
            background: "#fff",
            width: "100%"
          }}
        >
          <Content>
            <Component {...pageProps} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
