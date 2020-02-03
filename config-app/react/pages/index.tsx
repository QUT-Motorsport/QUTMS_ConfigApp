import Head from "next/head";
import "../css/home.css";
import HomeMenu from "../components/Layout/HomeMenu";
import Link from "next/link";

export default () => (
  <>
    <div>
      <Head>
        <title>QUT Motorsport Config App</title>
      </Head>
      <HomeMenu />
    </div>
  </>
);
