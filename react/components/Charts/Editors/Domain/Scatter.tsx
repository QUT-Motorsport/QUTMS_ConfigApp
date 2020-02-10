import { Form, Select, Checkbox } from "antd";
import { EditorProps } from "../Base";
import { ScatterChartDomain } from "../../../../ts/chartTypes";

export default ({
  data,
  specState: [spec, setSpec]
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
    <Form.Item label="Show Trendline">
      <Checkbox
        checked={spec.trendline}
        onChange={e => {
          setSpec({ ...spec, trendline: e.target.checked });
        }}
      />
    </Form.Item>
  </>
);
