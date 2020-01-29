import React from "react";

const Weather = () => {
    return (
        <div>
            <div style={{ float: "left", width: "33.3%" }}>
                <b>Humidity</b>
                <p>30%</p>
            </div>

            <div style={{ float: "left", width: "33.3%" }}>
                <b>Temperature</b>
                <p>32</p>
            </div>
            <div style={{ float: "left", width: "33.3%" }}>
                <b>Weather</b>
                <p>Cloudy</p>
            </div>
        </div>
    )
}

export default Weather;