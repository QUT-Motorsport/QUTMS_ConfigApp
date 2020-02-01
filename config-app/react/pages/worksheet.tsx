import dynamic from "next/dynamic";
const WorkSheet = dynamic(() => import("../components/WorkSheet"), {
  ssr: false
});
import { useQmsData } from "../ts/qmsData";
import { Spin } from "antd";

export default ({ _qmsData: data = useQmsData("Sample") }) =>
  data ? (
    <WorkSheet
      data={data}
      charts={[{ channel_idxs: [40, 41, 42] }, { channel_idxs: [36, 37, 38] }]}
    />
  ) : (
    <Spin />
  );
