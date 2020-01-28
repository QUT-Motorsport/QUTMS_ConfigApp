import Head from "next/head";
import Link from "next/link";

import Clock from "../components/Clock";
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
        <div style={{ height: "100%" }}>
            <Row>
                <Col span={5} >
                    <DriverInfo />
                    <LapInfo />
                    <PedalPositions />
                    <EngineAndPower />
                </Col>
                <Col span={5}>
                    <Car />
                </Col>
                <Col span={7}>
                    <SteeringAngle />
                    <RawTelemetry />
                    <DataRate />
                </Col>
                <Col span={7}>
                    <TrackInfo />
                    <Weather />
                </Col>
            </Row>
            <Row style={{ textAlign: "center", bottom: 0 }}>
                <Sponsors />
            </Row>
        </div>
    </>
);