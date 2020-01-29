import React from "react";

const SteeringAngle = () => {
    return (
        <div>
            <img style={{ float: "left" }} src="https://i0.wp.com/boxthislap.org/app/uploads/2019/08/CSL-E-F1-SET-M_07.png?resize=540%2C300&ssl=1" alt="Steering Wheel" height="" width="150px" />
            <div style={{ float: "left", margin: "auto" }}>
                <b>Minimum</b>
                <p>-0.4</p>
            </div>
            <div style={{ float: "left", margin: "auto" }}>
                <b>Current</b>
                <p>1.2</p>
            </div>
            <div style={{ float: "left", margin: "auto" }}>
                <b>Maximum</b>
                <p>1.5</p>
            </div>
        </div>
    )
}

export default SteeringAngle;