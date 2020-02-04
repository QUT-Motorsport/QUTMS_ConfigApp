import Head from "next/head";
import HomeMenu from "../components/Layout/HomeMenu";
import "../styles/home.css";

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
