import React, { useState, useEffect } from "react";
import "@annotationhub/react-golden-layout/dist/css/goldenlayout-base.css";
import "@annotationhub/react-golden-layout/dist/css/themes/goldenlayout-light-theme.css";
import GoldenLayout, {
  GoldenLayoutComponent,
} from "@annotationhub/react-golden-layout";

function ComponentA() {
  return <h2>A</h2>;
}

function ComponentB() {
  return <h2>B</h2>;
}

function ComponentC(props: any) {
  return <h2>{props.myText}</h2>;
}

export default function GoldenTest() {
  const [content, setContent] = useState<GoldenLayout.ItemConfigType[]>([]);

  useEffect(() => {
    const id = setTimeout(() => {
      setContent([
        {
          type: "row",
          content: [
            {
              component: ComponentA,
              title: "A Component",
            },
            {
              type: "column",
              content: [
                {
                  component: ComponentB,
                  title: "B Component",
                },
                {
                  component: () => <ComponentC myText="Component with Props" />,
                  title: "C Component",
                },
              ],
            },
          ],
        },
      ]);
    }, 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div>
      <GoldenLayoutComponent
        htmlAttrs={{ style: { width: "100vw", height: "100vh" } }}
        config={{
          content,
        }}
      />
    </div>
  );
}
