import React, { useState } from "react";
import { Button, Modal, Spin, Avatar } from "antd";

import AnalysisMenu from "../components/Layout/AnalysisMenu";
import { AnyChartSpec } from "../components/Charts/AnyChart";
import { QmsData } from "../ts/qmsData/types";
import { Crossfilter } from "../ts/qmsData/crossfilter/types";
import useQmsData from "../ts/qmsData/useQmsData";
import { SettingOutlined } from "@ant-design/icons";

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

function AnalysisSettingsModal() {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{
        float: "right",
        paddingTop: "15px",
        paddingRight: "26px",
      }}
    >
      <div style={{ cursor: "pointer" }} onClick={() => setVisible(true)}>
        <Avatar size="large" icon={<SettingOutlined />} />
      </div>
      <Modal
        title="Component Settings"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        style={{ marginTop: "120px" }}
      >
        <p>Add settings</p>
      </Modal>
    </div>
  );
}

export default function AnalysisPage() {
  const filterState = useCrossfilterState();
  const data = useQmsData("Sample");
  const [chartSpecs, setChartSpecs] = useState<AnyChartSpec[]>([]);

  useTitle("QUTMS Analysis");

  return data ? (
    <div className={styles.page}>
      <AnalysisMenu data={data} />
      <div className={styles.workbook}>
        <div className={styles.headerBorder}>
          <span className={styles.h1Alt}>Analysis</span>
          <AnalysisSettingsModal />
        </div>
        <Timeline data={data} filterState={filterState} />
        {chartSpecs.map((chartSpec, idx) => (
          <BaseChart
            key={idx}
            data={data}
            filterState={filterState}
            spec={chartSpec}
          />
        ))}
        <AddChartModal
          data={data}
          onAddChartSpec={(chartSpec) =>
            setChartSpecs([...chartSpecs, chartSpec])
          }
        />
      </div>
    </div>
  ) : (
    <Spin />
  );
}

function useCrossfilterState() {
  return useState<Crossfilter>({
    byChannels: new Map(),
  });
}
