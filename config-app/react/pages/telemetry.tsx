import Head from "next/head";
import Link from "next/link";

import Sponsors from "../components/Sponsors";
import PedalPositions from "../components/PedalPosition";
import Car from "../components/Car";
import LapInfo from "../components/LapInfo";
import SteeringAngle from "../components/SteeringAngle";
import Weather from "../components/Weather";
import { Row, Col } from "antd";
import TrackInfo from "../components/TrackInfo";
import RawTelemetry from "../components/RawTelemetry";
import DataRate from "../components/DataRate";
import EngineAndPower from "../components/EngineAndPower";
import DriverInfo from "../components/DriverInfo";

export default () => (
  <>
    <Head>
      <title>Live Telemetry</title>
    </Head>
    <div style={{ height: "100vh" }}>
      <Row style={{ height: "80vh" }}>
        <Col span={5} style={{ padding: "10px 20px" }}>
          <DriverInfo />
          <Car />
        </Col>
        <Col span={5} style={{ padding: "10px 20px" }}>
          <LapInfo />
          <SteeringAngle />
        </Col>
        <Col span={7} style={{ padding: "10px 20px" }}>
          <EngineAndPower />
          <RawTelemetry />
        </Col>

        <Col span={7} style={{ padding: "10px 20px" }}>
          <TrackInfo />
        </Col>
      </Row>
      <Row>
        <Sponsors />
      </Row>
    </div>
  </>
);
