//for testing - should delete

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const TestData = dynamic(() => import("../components/TestData"), {
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
  data ? <TestData data={data} /> : <Spin />;
