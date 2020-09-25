import React from "react"
import { Col, Row, Typography } from "antd"

import { useTitle } from "./_helpers";
import styles from "./DebugPage.module.scss"

const { Title } = Typography

export default function DebugPage() {

    useTitle("CAN Debugger");
    return (<>
        <Row className={styles.debugPage}>
            <Col span={24}>
                <Title className={"title"}>CAN Debugger</Title>
            </Col>
        </Row>
    </>)
}