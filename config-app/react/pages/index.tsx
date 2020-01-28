import Head from "next/head";
import Link from "next/link";
import { Row, Col } from "antd";
import "../css/home.css";

export default () => (
  <>
    <div>
      <Head>
        <title>QUT Motorsport Config App</title>
      </Head>
      <body>
        <div className="flex-container">
          <div className="column-border-one"></div>
          <div className="column-main-one">
            <div>
              <header>Home</header>
              <h1>Start</h1>
              <p>Open File...</p>
              <p>Import...</p>
              <p>Initialise Serial</p>
              <p>Initialise UDP</p>
              <h1>Recent</h1>
              <p>recent_file_dummy_1</p>
              <p>recent_file_dummy_2</p>
              <p>recent_file_dummy_3</p>
              <p>More...</p>
              <h1>Simulation</h1>
              <p>Import...</p>
              <p>View...</p>
            </div>
          </div>
          <div className="column-main-two">
            <h2></h2>
            <div className="block">
              <h1>Customise</h1>
              <p>MATLAB Engine</p>
              <p>Settings & Keybindings</p>
              <p>Change Theme</p>
              <h3></h3>
              <h1>Help</h1>
              <p>Get Started</p>
              <p>Data Analysis Information</p>
              <p>Export/Import Guide</p>
              <h4></h4>
              <h1>Contact</h1>
              <p>Website</p>
              <p>Facebook</p>
              <p>Twitter</p>
            </div>
          </div>
          <div className="column-border-two"></div>
        </div>
      </body>
    </div>
  </>
);
