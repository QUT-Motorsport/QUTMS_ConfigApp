import { Layout, Menu, Icon, Alert } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import Explorer from "../components/Layout/Explorer";
const { Header, Content, Footer, Sider } = Layout;

export default (props: any) => (
  <>
    <Explorer />
    <Alert
      message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
      type="warning"
      closable
    />
  </>
);
