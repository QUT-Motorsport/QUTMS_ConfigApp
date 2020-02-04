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
    <div>
      <Row>
        <Col
          lg={{ span: 5 }}
          md={{ span: 24 }}
          xs={{ span: 24 }}
          style={{ padding: "10px 20px" }}
        >
          <DriverInfo />
          <Car />
        </Col>
        <Col
          lg={{ span: 5 }}
          md={{ span: 12 }}
          xs={{ span: 24 }}
          style={{ padding: "10px 20px" }}
        >
          <LapInfo />
          <SteeringAngle />
        </Col>
        <Col
          lg={{ span: 7 }}
          md={{ span: 12 }}
          xs={{ span: 24 }}
          style={{ padding: "10px 20px" }}
        >
          <EngineAndPower />
          <RawTelemetry />
        </Col>

        <Col
          lg={{ span: 7 }}
          md={{ span: 24 }}
          xs={{ span: 24 }}
          style={{ padding: "10px 20px" }}
        >
          <TrackInfo />
        </Col>
      </Row>
      <Row>
        <Col
          lg={{ span: 24 }}
          md={{ span: 24 }}
          xs={{ span: 24 }}
          style={{ padding: "10px 20px" }}
        >
          <Sponsors />
        </Col>
      </Row>
    </div>
  </>
);
