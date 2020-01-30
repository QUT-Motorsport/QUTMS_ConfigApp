import Head from "next/head";
import Link from "next/link";
import { Row, Col } from "antd";
import "../css/home.css";
import HomeMenu from "../components/Layout/HomeMenu";

export default () => (
  <>
    <div>
      <Head>
        <title>QUT Motorsport Config App</title>
      </Head>
      <Link href="/worksheet">
        <a style={{ fontSize: "3rem" }}>Worksheet DEMO</a>
      </Link>
      <HomeMenu />
    </div>
  </>
);
