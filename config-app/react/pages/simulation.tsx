import { Layout, Menu, Icon, Alert } from "antd";
import Head from "next/head";
import SubMenu from "antd/lib/menu/SubMenu";
import Explorer from "../components/Layout/Explorer/Explorer";
const { Header, Content, Footer, Sider } = Layout;

export default (props: any) => (
  <>
    <Head>
      <title>QUT Config App - Simulation</title>
    </Head>
    <Explorer />
    <Alert
      message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
      type="warning"
      closable
    />
  </>
);
