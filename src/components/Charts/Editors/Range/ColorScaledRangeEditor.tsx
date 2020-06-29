import { Form, Select, InputNumber, Radio } from "antd";
import React from "react";
import { EditorProps } from "../BaseChartEditor";
import { Channel } from "../../../../ts/qmsData";
import {
  ColourScaled,
  DiscretelyColourScaled,
} from "../../../../ts/chart/types";
import { channelOptionAttrs } from "./_helpers";

const ColourScaledRangeEditor = ({
  data,
  specState: [spec, setSpec],
}: EditorProps<ColourScaled>) => (
  <>
    {"yAxis" in spec ? ( // if a y axis can be chosen
      <Form.Item label="Y Axis" wrapperCol={{ xs: { span: 10 } }}>
        <Select
          optionFilterProp="children"
          value={spec.yAxis}
          onChange={(yAxis: number) => {
            setSpec({ ...spec, yAxis });
          }}
        >
          {data.channels.map((channel, idx) => (
            <Select.Option {...channelOptionAttrs(channel as Channel, idx)} />
          ))}
        </Select>
      </Form.Item>
    ) : null}

    <Form.Item label="Color Axis" wrapperCol={{ xs: { span: 10 } }}>
      <Select
        optionFilterProp="children"
        value={spec.colourAxis}
        onChange={(colourAxis: ColourScaled["colourAxis"]) => {
          setSpec({ ...spec, colourAxis });
        }}
      >
        {data.channels.map((channel, idx) => (
          <Select.Option {...channelOptionAttrs(channel as Channel, idx)} />
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      label="Colour-Scale"
      wrapperCol={{ xs: { span: 18 }, sm: { span: 16 } }}
    >
      <Radio.Group
        value={"nColourBins" in spec ? "discrete" : "continuous"}
        onChange={(e) => {
          // I don't like this but it's fine for now
          setSpec((spec) => {
            if (e.target.value === "continuous" && "nColourBins" in spec) {
              delete spec.nColourBins;
            } else {
              (spec as DiscretelyColourScaled).nColourBins = 8;
            }
            return { ...spec };
          });
        }}
      >
        <Radio.Button value="continuous">Continous</Radio.Button>
        <Radio.Button value="discrete">Discrete</Radio.Button>
      </Radio.Group>

      {"nColourBins" in spec ? ( // if in discrete mode
        <>
          <span style={{ padding: "0px 10px 0px 60px" }}># Color Bins:</span>
          <InputNumber
            min={3}
            max={13}
            value={spec.nColourBins}
            onChange={(nColourBins) => {
              if (typeof nColourBins === "number") {
                setSpec({ ...spec, nColourBins });
              }
            }}
          />
        </>
      ) : null}
    </Form.Item>
  </>
);

export default ColourScaledRangeEditor;
