import "antd/dist/antd.css";
import { ComponentType, ComponentProps } from "react";
import { Upload, message, Layout, Menu, Breadcrumb, Icon, Avatar } from "antd";

import Link from "next/link";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default <Page extends ComponentType<any>>({
  Component,
  pageProps
}: {
  Component: Page;
  pageProps: ComponentProps<Page>;
}) => (
  <Layout id="whole">
    <Header className="header" style={{ background: "#fff", height: "80px" }}>
      <Link href="/">
        <a className="logo" style={{ marginLeft: "-45px", float: "left" }}>
          <img src="/images/qms_icon_2.png" />
        </a>
      </Link>
      <Link href="">
        <a style={{ float: "right", paddingTop: "5px", marginRight: "-20px" }}>
          <Avatar size="large" icon="user" />
        </a>
      </Link>
    </Header>
    <Layout>
      <Sider width={140} style={{ background: "#E6E6E6" }}>
        <Menu
          mode="vertical"
          style={{
            background: "#E6E6E6",
            textAlign: "left"
          }}
        >
          <a>
            <Menu.Item key="sub1" style={{ padding: "40px 0 40px 10px" }}>
              <span>
                <Icon type="dashboard" /> Telemetry
              </span>
            </Menu.Item>
          </a>

          <a href="/analysis">
            <Menu.Item key="sub2" style={{ padding: "40px 0 40px 10px" }}>
              <span>
                <Icon type="line-chart" /> Analysis
              </span>
            </Menu.Item>
          </a>
          <a>
            <Menu.Item key="sub3" style={{ padding: "40px 0 40px 10px" }}>
              <span>
                <Icon type="code" /> Config
              </span>
            </Menu.Item>
          </a>
          <a>
            <Menu.Item key="sub4" style={{ padding: "40px 0 40px 10px" }}>
              <span>
                <Icon type="heat-map" /> Simulation
              </span>
            </Menu.Item>
          </a>
        </Menu>
      </Sider>

      <Layout
        style={{ background: "#fff", marginTop: "8px", marginLeft: "8px" }}
      >
        <Content>
          <Component {...pageProps} />
        </Content>
      </Layout>
    </Layout>
  </Layout>
);
