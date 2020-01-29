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
}) => (
  <Layout
    id="whole"
    style={{
      width: "100%",
      height: "100vh",
      overflow: "hidden"
    }}
  >
    <Header />
    <Layout>
      <SideBar />
      <Layout style={{ background: "#fff", margin: "10px 10px 0px 10px" }}>
        <Content>
          <Component {...pageProps} />
        </Content>
      </Layout>
    </Layout>
  </Layout>
);
