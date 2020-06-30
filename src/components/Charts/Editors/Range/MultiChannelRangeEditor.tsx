import React from "react";
import { Form, Select, Button } from "antd";
import { EditorProps } from "../BaseChartEditor";
import { ChannelHeader, ChannelIdx } from "../../../../ts/qmsData/types";
import { channelOptionAttrs } from "./_helpers";
import { DeleteOutlined } from "@ant-design/icons";

import styles from "./MultiChannelRangeEditor.module.scss";

export type MultiChannel = {
  rangeType: "MultiChannel";
  yAxes: ChannelHeader[][];
};

export default function MultiChannelChartEditor({
  data,
  specState: [spec, setSpec],
}: EditorProps<MultiChannel>) {
  return (
    <div className={styles.multiChannel}>
      <Form.Item
        label="Channels"
        wrapperCol={{ xs: { span: 18 }, sm: { span: 16 } }}
      >
        {spec.yAxes.map((yAxis, idx) => (
          <div key={idx}>
            <Select
              mode="multiple"
              className="select-channels"
              optionFilterProp="children"
              value={yAxis.map(({ idx }) => idx)}
              onChange={(channelIdxs: ChannelIdx[]) => {
                spec.yAxes[idx] = channelIdxs.map((idx) => data.channels[idx]);
                setSpec({ ...spec });
              }}
            >
              {data.channels.map((channel, idx) => (
                <Select.Option {...channelOptionAttrs(channel, idx)} />
              ))}
            </Select>
            {idx > 0 ? (
              <Button
                style={{ marginLeft: 5 }}
                danger
                onClick={() => {
                  spec.yAxes.splice(idx, 1);
                  setSpec({ ...spec });
                }}
              >
                <DeleteOutlined />
              </Button>
            ) : null}
          </div>
        ))}
        {spec.yAxes.length < 2 ? (
          <Button
            onClick={() => {
              spec.yAxes.push([]);
              setSpec({ ...spec });
            }}
          >
            Add Y Axis
          </Button>
        ) : null}
      </Form.Item>
    </div>
  );
}
