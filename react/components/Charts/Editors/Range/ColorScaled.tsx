import { EditorProps } from "../Base";
import { ColorScaled } from "../../../../ts/chart/types";
import { Form, Select, InputNumber, Radio } from "antd";
import { channelOptionAttrs } from "./_helpers";

export default ({
  data,
  specState: [spec, setSpec]
}: EditorProps<ColorScaled>) => (
  <>
    {"yAxis" in spec ? ( // if not a colorscale-only plot
      <Form.Item
        label="Y Axis"
        wrapperCol={{ xs: { span: 18 }, sm: { span: 16 } }}
      >
        <Select
          optionFilterProp="children"
          value={spec.yAxis}
          onChange={(yAxis: number) => {
            setSpec({ ...spec, yAxis });
          }}
        >
          {data.channels.map((channel, idx) => (
            <Select.Option {...channelOptionAttrs(channel, idx)} />
          ))}
        </Select>
      </Form.Item>
    ) : null}

    <Form.Item
      label="Color Axis"
      wrapperCol={{ xs: { span: 18 }, sm: { span: 16 } }}
    >
      <Select
        optionFilterProp="children"
        value={spec.colorAxis}
        onChange={(colorAxis: ColorScaled["colorAxis"]) => {
          setSpec({ ...spec, colorAxis });
        }}
      >
        {data.channels.map((channel, idx) => (
          <Select.Option {...channelOptionAttrs(channel, idx)} />
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      label="Colour-Scale"
      wrapperCol={{ xs: { span: 18 }, sm: { span: 16 } }}
    >
      <Radio.Group
        value={spec.nColorBins === null ? "continuous" : "discrete"}
        onChange={e =>
          setSpec({
            ...spec,
            nColorBins: e.target.value === "continuous" ? null : 8
          })
        }
      >
        <Radio.Button value="continuous">Continous</Radio.Button>
        <Radio.Button value="discrete">Discrete</Radio.Button>
      </Radio.Group>

      {spec.nColorBins !== null ? ( // if in discrete mode
        <>
          <span style={{ padding: "0px 10px 0px 60px" }}># Color Bins:</span>
          <InputNumber
            min={3}
            max={13}
            value={spec.nColorBins}
            onChange={nColorBins => {
              if (typeof nColorBins === "number") {
                setSpec({ ...spec, nColorBins });
              }
            }}
          />
        </>
      ) : null}
    </Form.Item>
  </>
);
