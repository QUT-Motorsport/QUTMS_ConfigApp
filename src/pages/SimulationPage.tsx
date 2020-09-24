import React, { useState, useEffect } from "react";
import "@annotationhub/react-golden-layout/dist/css/goldenlayout-base.css";
import "@annotationhub/react-golden-layout/dist/css/themes/goldenlayout-light-theme.css";
import GoldenLayout, {
  GoldenLayoutComponent,
} from "@annotationhub/react-golden-layout";

function Counter({ init = 0, increment = 1 }) {
  const [count, setCount] = useState(init);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
    return () => clearInterval(id);
  });

  return <h2>COUNTER {count}</h2>;
}

export default function GoldenTest() {
  // const [layoutManager, setLayoutManager] = useState<GoldenLayout>();s

  return (
    <div>
      <GoldenLayoutComponent
        htmlAttrs={{ style: { width: "100vw", height: "100vh" } }}
        config={{
          content: [
            {
              type: "row",
              content: [{ component: Counter, title: "counter 1" }],
            },
          ],
        }}
        autoresize
        debounceResize={300}
        onLayoutReady={(layoutManager) => {
          console.log("manager", layoutManager);
        }}
      />
    </div>
  );
}
