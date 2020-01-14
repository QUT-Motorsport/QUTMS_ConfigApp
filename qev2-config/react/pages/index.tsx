import React from "react";
import Head from "next/head";
import Link from "next/link";

import Clock from "../components/Clock";

export default () => (
  <>
    <Head>
      <title>Home - Nextron (custom-server-typescript)</title>
    </Head>
    <div>
      <p>
        ⚡ Electron + Next.js ⚡ -
        <Link href="/calculator">
          <a>Go to calculator</a>
        </Link>
      </p>
      <Clock />
      <img src="/images/logo.png" />
    </div>
  </>
);
