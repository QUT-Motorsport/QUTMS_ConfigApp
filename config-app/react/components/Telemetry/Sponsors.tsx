import React from "react";

const Sponsors = () => {
  return (
    <div>
      <h3 style={{ textAlign: "center", color: "#0F406A", padding: "0" }}>
        Our Sponsors
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <div>
          <img
            src="http://1oqcj13c6kcsgsd3azleb4j2.wpengine.netdna-cdn.com/wp-content/uploads/2013/06/nasa-logo-grey-300x248.png"
            alt="NASA Logo"
            height="64"
          ></img>
        </div>
        <div>
          <img
            src="https://assets2.hrc.org/files/images/corporatedownloads/MSFT_logo_bw.png"
            alt="Microsoft Logo"
            height="64"
          ></img>
        </div>

        <div>
          <img
            src="https://criticalcommunicationsfinland.fi/wp-content/uploads/2017/04/aibus-logo-grey-new.png"
            alt="Airbus Logo"
            height="64"
          ></img>
        </div>
        <div>
          <img
            src="https://i1.wp.com/produktivmedia.com/wp-content/uploads/2018/03/Toyota.png?ssl=1"
            alt="Boeing Logo"
            height="64"
          ></img>
        </div>
        <div>
          <img
            src="https://www.spacetelescope.org/static/archives/logos/transparent/esa_screen_grey.png"
            alt="ESA Logo"
            height="64"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
