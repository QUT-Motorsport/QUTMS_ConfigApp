import React from 'react';
import { Progress } from 'antd';

const pedalPositions = () => {
    return (
        <div>
            <h3>Pedal Positions</h3>
            <Progress percent={50} showInfo={true} strokeColor="#28A745" strokeWidth={20} strokeLinecap="square" />
            <Progress percent={50} showInfo={true} strokeColor="#DC3545" strokeWidth={20} strokeLinecap="square" />
        </div>
    )
}

export default pedalPositions;