import React from 'react';
import { Progress } from 'antd';

const lapInfo = () => {
    return (
        <div>
            <h3>Lap Info</h3>
            <div style={{ width: "100%" }}>
                <div style={{ float: "left", width: "50%" }}>
                    <b>Current Lap</b>
                    <p>1:00:02</p>
                </div>
                <div style={{ float: "left", width: "50%" }}>
                    <b>Best Lap</b>
                    <p>1:00:09</p>
                </div>
            </div>

            <b>Top Lap Speed</b>
            <p>100km/h</p>

            <b>Total Laps</b>
            <br />
            <Progress type="circle" percent={75} format={percent => `4/10`} strokeColor="#0F406A" strokeWidth={12} />
        </div >
    )
}

export default lapInfo;