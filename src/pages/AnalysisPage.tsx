import React, { useEffect } from "react";
import { Button, Modal, Spin } from "antd";
import { useState } from "react";
import AnalysisMenu from "../components/Layout/AnalysisMenu";
import SubHeader from "../components/Layout/SubHeader";
import { ChartSpec, Range } from "../ts/chart/types";
import { QmsData, useQmsData } from "../ts/qmsData";
import { DEFAULT_LINE_CHART } from "../ts/chart/defaults";

import Timeline from "../components/Timeline";
import BaseChartEditor from "../components/Charts/Editors/BaseChartEditor";

import BaseChart from "../components/Charts/BaseChart";
import { useTitle } from "./_helpers";

import styles from "./AnalysisPage.module.scss";

const AddChartModal = ({
  onAddChartSpec,
  data,
}: {
  onAddChartSpec: (type: ChartSpec) => void;
  data: QmsData;
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [chartSpec, setChartSpec] = useState<ChartSpec>(DEFAULT_LINE_CHART);

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
          setChartSpec(DEFAULT_LINE_CHART);
          setVisible(false);
        }} // use this to handle add component
        onCancel={() => setVisible(false)}
      >
        <BaseChartEditor data={data} specState={[chartSpec, setChartSpec]} />
        <BaseChart
          data={data}
          spec={chartSpec}
          domainState={useState<Range>()}
        />
      </Modal>
    </div>
  );
};

function AnalysisPage() {
  const data = useQmsData("Sample");
  const domainState = useState<Range>();
  const [chartSpecs, setChartSpecs] = useState<ChartSpec[]>([]);

  useTitle("QUTMS Analysis");

  return data ? (
    <div className={styles.page}>
      <AnalysisMenu data={data} />
      <div className={styles.workbook}>
        <SubHeader />

        <Timeline data={data} domainState={domainState} />

        {chartSpecs.map((chartSpec, idx) => (
          <BaseChart
            key={idx}
            data={data}
            domainState={domainState}
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

export default AnalysisPage;
