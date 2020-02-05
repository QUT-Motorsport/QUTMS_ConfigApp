import Head from "next/head";
import Link from "next/link";

import Sponsors from "../components/Telemetry/Sponsors";
import PedalPositions from "../components/Telemetry/PedalPosition";
import Car from "../components/Telemetry/Car";
import LapInfo from "../components/Telemetry/LapInfo";
import SteeringAngle from "../components/Telemetry/SteeringAngle";
import Weather from "../components/Telemetry/Weather";
import { Row, Col } from "antd";
import TrackInfo from "../components/Telemetry/TrackInfo";
import RawTelemetry from "../components/Telemetry/RawTelemetry";
import DataRate from "../components/Telemetry/DataRate";
import EngineAndPower from "../components/Telemetry/EngineAndPower";
import DriverInfo from "../components/Telemetry/DriverInfo";
import Explorer from "../components/Layout/Explorer/Explorer";

export default () => (
  <>
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
