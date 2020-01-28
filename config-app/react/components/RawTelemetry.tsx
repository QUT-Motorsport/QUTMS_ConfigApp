import React, { Component } from "react";
import { Table, Divider, Tag } from 'antd';

class RawTelemetry extends Component {
    render() {
        const columns = [
            {
                title: 'Channel',
                dataIndex: 'channel',
                key: 'channel',
            },
            {
                title: 'Reading',
                dataIndex: 'reading',
                key: 'reading',
            },
            {
                title: 'Unit',
                key: 'unit',
                dataIndex: 'unit'
            }
        ];

        const data = [
            {
                key: '1',
                channel: 'Longitudal Velocity',
                reading: 1,
                unit: 'g'
            },
            {
                key: '2',
                channel: 'Air Pressure',
                reading: 40,
                unit: 'ppi'
            },
            {
                key: '3',
                channel: 'Speed',
                reading: 32,
                unit: 'km/h'
            },
        ];
        return (
            <div>
                <Table columns={columns} dataSource={data} />
            </div>
        )
    }
}

export default RawTelemetry;