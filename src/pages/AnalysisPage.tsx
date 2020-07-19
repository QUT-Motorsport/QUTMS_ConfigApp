import React, { useState, useRef } from "react";
import { Button, Modal, Spin, Layout } from "antd";

import "@annotationhub/react-golden-layout/dist/css/goldenlayout-base.css";
import "@annotationhub/react-golden-layout/dist/css/themes/goldenlayout-light-theme.css";
import { GoldenLayoutComponent } from "@annotationhub/react-golden-layout";

import AnalysisMenu from "../components/Layout/AnalysisMenu";
import { AnyChartSpec } from "../components/Charts/AnyChart";
import { QmsData } from "../ts/qmsData/types";
import useCrossfilterState from "../ts/qmsData/crossfilter/useCrossfilterState";
import useQmsData from "../ts/qmsData/useQmsData";
import Plotly from "plotly.js";

import Timeline from "../components/Charts/Timeline";
import BaseChartEditor, {
  getDefaultCharts,
} from "../components/Charts/Editors/BaseChartEditor";

import BaseChart from "../components/Charts/AnyChart";
import { useTitle } from "./_helpers";

import styles from "./AnalysisPage.module.scss";

function AddChartModal({
  onAddChartSpec,
  data,
}: {
  onAddChartSpec: (type: AnyChartSpec) => void;
  data: QmsData;
}) {
  const [visible, setVisible] = useState<boolean>(false);

  const defaultLineChart = getDefaultCharts(data)["Line"];

  const [chartSpec, setChartSpec] = useState<AnyChartSpec>(defaultLineChart);

  return (
    <div className={styles.addChartModal}>
      <Button type="primary" onClick={() => setVisible(true)}>
        + Add Chart
      </Button>

      <Modal
        title="Add Chart"
        visible={visible}
        width={800}
        onOk={() => {
          onAddChartSpec(chartSpec);
          setChartSpec(defaultLineChart);
          setVisible(false);
        }} // use this to handle add component
        onCancel={() => setVisible(false)}
      >
        <BaseChartEditor data={data} specState={[chartSpec, setChartSpec]} />
        <BaseChart
          data={data}
          spec={chartSpec}
          filterState={useCrossfilterState()}
        />
      </Modal>
    </div>
  );
}

export default function AnalysisPage() {
  const filterState = useCrossfilterState();
  const data = useQmsData("Sample");
  const [chartSpecs, setChartSpecs] = useState<AnyChartSpec[]>([]);
  const figureRef = useRef<HTMLElement>();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useTitle("QUTMS Analysis");

  return data ? (
    <>
      <AnalysisMenu
        data={data}
        collapsedState={[
          collapsed,
          // TODO: Make this more standard (resizing plots when elements move around)
          (isCollapsed) => {
            setTimeout(() => {
              if (figureRef.current) {
                Plotly.Plots.resize(figureRef.current);
              }
            }, 200);
            setCollapsed(isCollapsed);
          },
        ]}
      />
      <Layout>
        <Layout.Content>
          <Timeline
            data={data}
            filterState={filterState}
            figureRef={figureRef}
          />
          <GoldenLayoutComponent
            htmlAttrs={{
              style: {
                width: "100%",
                height: "400px",
              },
            }}
            config={{
              content: chartSpecs.map((chartSpec, idx) => ({
                title: chartSpec.title,
                component: (
                  <BaseChart
                    key={idx}
                    data={data}
                    filterState={filterState}
                    spec={chartSpec}
                  />
                ),
              })),
            }}
          />
          {}
          <AddChartModal
            data={data}
            onAddChartSpec={(chartSpec) =>
              setChartSpecs([...chartSpecs, chartSpec])
            }
          />
        </Layout.Content>
      </Layout>
    </>
  ) : (
    <Spin />
  );
}
