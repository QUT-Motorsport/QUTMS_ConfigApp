import React from 'react';
import { Progress } from 'antd';

const EngineAndPower = () => {
    return (
        <div>
            <h3>Pedal Positions</h3>
            <Progress type="dashboard" percent={80} showInfo={true} strokeColor="#0F406A" strokeWidth={12} gapDegree={140} format={percent => `${percent}`} />
        </div>
    )
}

export default EngineAndPower;