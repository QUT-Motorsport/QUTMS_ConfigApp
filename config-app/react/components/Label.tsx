import React from "react";

const Label = (props: any) => {
  return (
    <p
      style={{
        marginBottom: "12px",
        fontSize: "14px",
        color: "rgba(0, 0, 0, 0.45)",
        padding: "0"
      }}
    >
      {props.title}
    </p>
  );
};

export default Label;
