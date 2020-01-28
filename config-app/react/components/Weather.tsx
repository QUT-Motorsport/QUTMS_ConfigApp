import React from "react";
import { Icon } from "antd";

const Weather = () => {
    return (
        <div>
            <div>
                <b>Humidity</b>
                <p>30%</p>
            </div>

            <div>
                <b>Temperature</b>
                <p>32</p>
            </div>
            <div>
                <b>Weather</b>
                <Icon type="cloud" />
            </div>
        </div>
    )
}

export default Weather;