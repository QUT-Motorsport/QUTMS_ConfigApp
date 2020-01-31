import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const WorkSheet = dynamic(() => import("../components/WorkSheet"), {
  ssr: false
});
import { QmsData } from "../ts/api";
import { Spin } from "antd";
const useQmsData = (filename: string): QmsData | null => {
  const [qmsData, setQmsData] = useState<QmsData | null>(null);

  useEffect(() => {
    QmsData.download(filename).then(setQmsData);
  }, []);

  return qmsData;
};

export default ({ _qmsData: data = useQmsData("Sample") }) =>
  data ? (
    <WorkSheet
      data={data}
      charts={[{ channel_idxs: [40, 41, 42] }, { channel_idxs: [36, 37, 38] }]}
    />
  ) : (
    <Spin />
  );
