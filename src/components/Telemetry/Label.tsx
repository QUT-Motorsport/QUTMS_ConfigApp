import React, { CSSProperties } from "react";

export default ({
  title,
  style = {},
}: {
  title: string;
  style?: CSSProperties;
}) => (
  <p
    style={{
      marginBottom: "12px",
      fontSize: "14px",
      color: "rgba(0, 0, 0, 0.45)",
      padding: "0",
      fontWeight: 600,
      ...style,
    }}
  >
    {title}
  </p>
);
