import ModalAdd from "../components/Layout/Modal_Add_Group";
import AnalysisMenu from "../components/Layout/AnalysisMenu";
import SubHeader from "../components/Layout/SubHeader";
import dynamic from "next/dynamic";
import "../css/home.css";
import { useQmsData } from "../ts/qmsData";
import { Spin } from "antd";

const WorkSheet = dynamic(() => import("../components/WorkSheet"), {
  ssr: false
});

export default ({ data = useQmsData("Sample") }) =>
  data ? (
    <div className="flex-container-menu">
      <AnalysisMenu data={data} />
      <div className="flex-container-analysis">
        <SubHeader />
        <WorkSheet
          data={data}
          charts={[
            { channel_idxs: [40, 41, 42] },
            { channel_idxs: [36, 37, 38] }
          ]}
        />
        <ModalAdd />
      </div>
    </div>
  ) : (
    <Spin />
  );
