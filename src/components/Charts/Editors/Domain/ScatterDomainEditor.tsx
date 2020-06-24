import React from "react";
import { Form, Select } from "antd";
import { EditorProps } from "../BaseChartEditor";
import { ScatterChartDomain } from "../../ScatterChart";

export default ({
  data,
  specState: [spec, setSpec],
}: EditorProps<ScatterChartDomain>) => (
  <>
    <Form.Item label="X Axis" wrapperCol={{ xs: { span: 10 } }}>
      <Select
        optionFilterProp="children"
        value={spec.xAxis}
        onChange={(xAxis: ScatterChartDomain["xAxis"]) => {
          setSpec({ ...spec, xAxis });
        }}
      >
        {data.channels.map(({ name, freq, unit }, idx) => (
          <Select.Option key={idx} value={idx} label={name} title={name}>
            {`${name} ${unit ? `(${unit})` : ""} [${freq} hz]`}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  </>
);
