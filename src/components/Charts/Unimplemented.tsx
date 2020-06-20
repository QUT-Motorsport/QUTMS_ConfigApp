import React from "react";

export default function UnImplemented(component: string) {
  return (_props: any) => (
    <div style={{ color: "red" }}>
      Sorry! {component} hasn't been implemented yet!
    </div>
  );
}
