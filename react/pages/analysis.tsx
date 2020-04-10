import { Button, Modal, Spin } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import AnalysisMenu from "../components/Layout/AnalysisMenu";
import SubHeader from "../components/Layout/SubHeader";
import Head from "next/head";
import { ChartSpec } from "../ts/chart/types";
import { StateHook } from "../ts/hooks";
import { QmsData, useQmsData, useCrossfilterState } from "../ts/qmsData";
import { DEFAULT_LINE_CHART } from "../ts/chart/defaults";

const Timeline = dynamic(() => import("../components/Timeline"), {
  ssr: false,
  loading: () => <Spin />,
});
import BaseChartEditor from "../components/Charts/Editors/Base";

const BaseChart = dynamic(() => import("../components/Charts/Base"), {
  ssr: false,
  loading: () => <Spin />,
});

const AddChartModal = ({
  onAddChartSpec,
  data,
  _visibleState: [visible, setVisible] = useState<boolean>(false),
  _chartSpecState: chartSpecState = useState<ChartSpec>(DEFAULT_LINE_CHART),
}: {
  onAddChartSpec: (type: ChartSpec) => void;
  data: QmsData;
  _visibleState?: StateHook<boolean>;
  _chartSpecState?: StateHook<ChartSpec>;
}) => {
  const [chartSpec, setChartSpec] = chartSpecState;

  return (
    <div className="root">
      <style jsx>{`
        .root {
          position: absolute;
          bottom: 10px;
          align-self: center;
          padding-right: 150px;
        }
      `}</style>

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
        <BaseChartEditor data={data} specState={chartSpecState} />
        <BaseChart
          data={data}
          spec={chartSpec}
          filtersState={useCrossfilterState()}
        />
      </Modal>
    </div>
  );
};

export default function AnalysisPage({ data = useQmsData("Sample") }) {
  const filtersState = useCrossfilterState();
  const [chartSpecs, setChartSpecs] = useState<ChartSpec[]>([]);

  if (!data) {
    return <Spin />;
  } else {
    return (
      <div className="flex-container-menu">
        <Head>
          <title>QUT Config App - Home</title>
        </Head>
        <AnalysisMenu data={data} />
        <div className="flex-container-analysis">
          <SubHeader />

          <Timeline data={data} filtersState={filtersState} />

          {chartSpecs.map((chartSpec, idx) => (
            <BaseChart
              key={idx}
              data={data}
              filtersState={filtersState}
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
        <Head>
          <title>QUT ConfigHub - Analysis</title>
        </Head>
      </div>
    );
  }
}
