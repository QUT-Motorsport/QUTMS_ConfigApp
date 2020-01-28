import "antd/dist/antd.css";
import Link from "next/link";
import { ComponentType, ComponentProps } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";

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
      <Header className="header" style={{ background: "#fff" }}>
        <div className="logo">
          <img src="/images/qms_icon_2.png" />
        </div>
      </Header>
      <Layout>
        <Sider width={120} style={{ background: "#E6E6E6" }}>
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
