import React from "react";
import { Form, Radio } from "antd";
import { EditorProps } from "../BaseChartEditor";

export type LineChartDomain = {
  domainType: "Line";
  xAxis: "Time" | "Distance";
};

export default function LineDomainEditor({
  specState: [spec, setSpec],
}: EditorProps<LineChartDomain>) {
  return (
    <Form.Item label="X Axis" wrapperCol={{ xs: { span: 6 } }}>
      <Radio.Group
        value={spec.xAxis}
        onChange={(e) => setSpec({ ...spec, xAxis: e.target.value })}
      >
        <Radio value={"Time"}>{"Time"}</Radio>
        <Radio value={"Distance"}>{"Distance"}</Radio>
      </Radio.Group>
    </Form.Item>
  );
}
