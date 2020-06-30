import React from "react";
import { Form, Select } from "antd";
import { EditorProps } from "../BaseChartEditor";
import { ChannelIdx, ChannelHeader } from "../../../../ts/qmsData/types";

export type ScatterChartDomain = {
  domainType: "Scatter";
  xAxis: ChannelHeader;
  showTrendline: Boolean;
};

export default ({
  data,
  specState: [spec, setSpec],
}: EditorProps<ScatterChartDomain>) => (
  <>
    <Form.Item label="X Axis" wrapperCol={{ xs: { span: 10 } }}>
      <Select
        optionFilterProp="children"
        value={spec.xAxis.idx}
        onChange={(idx: ChannelIdx) => {
          setSpec({ ...spec, xAxis: data.channels[idx] });
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
