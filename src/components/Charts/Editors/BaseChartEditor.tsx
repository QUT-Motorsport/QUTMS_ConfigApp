import React from "react";
import { Form, Radio, Input } from "antd";

import { QmsData } from "../../../ts/qmsData";
import { AnyChartSpec, ChartSpec } from "../AnyChart";
import { StateHook } from "../../../ts/hooks";
import {
  DEFAULT_RANGE_TYPES,
  DEFAULT_CHARTS,
} from "../../../ts/chart/defaults";

import TrackMap from "./Domain/TrackMapDomainEditor";
import Line from "./Domain/LineDomainEditor";
import Scatter from "./Domain/ScatterDomainEditor";
import Histogram from "./Domain/HistogramDomainEditor";

import ColourScaled from "./Range/ColorScaledRangeEditor";
import MultiChannel from "./Range/MultiChannelRangeEditor";

import styles from "./BaseChartEditor.module.scss";
import { LineChartDomain } from "../LineChart";
import { HistogramChartDomain } from "../HistogramChart";
import { HistoryOutlined } from "@ant-design/icons";

export type EditorProps<SpecType> = {
  data: QmsData;
  specState: StateHook<SpecType>;
};

export default function BaseChartEditor({
  data,
  specState,
}: EditorProps<AnyChartSpec>) {
  const [chartSpec, setChartSpec] = specState;

  return (
    <div className={styles.baseEditor}>
      {/* Let user set general chartspec attrs */}
      <Form labelCol={{ xs: { span: 6 } }}>
        <Form.Item
          label="Title"
          wrapperCol={{ xs: { span: 18 }, sm: { span: 11 } }}
        >
          <Input
            value={chartSpec.title}
            onChange={(e) =>
              setChartSpec({
                ...chartSpec,
                title: e.target.value,
              })
            }
          />
        </Form.Item>

        {/* Let user choose the domain type */}
        <Form.Item label="Chart Type" wrapperCol={{ xs: { span: 18 } }}>
          <Radio.Group
            value={chartSpec.domainType}
            onChange={(e) => {
              setChartSpec({
                ...chartSpec,
                ...DEFAULT_CHARTS[
                  e.target.value as keyof typeof DEFAULT_CHARTS
                ],
              });
            }}
          >
            {Object.keys(DEFAULT_CHARTS).map((domainType, idx) => (
              <Radio key={idx} value={domainType}>
                {domainType}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Display the specific domain editor */}
        {{ Line, Scatter, Histogram, TrackMap }[chartSpec.domainType]({
          data,
          specState,
        })}

        {/* show the different range options unless there are none available (in the case of TrackMap) */}
        {chartSpec.domainType === "TrackMap" ? null : (
          <Form.Item label="Plot Type" wrapperCol={{ xs: { span: 18 } }}>
            <Radio.Group
              value={chartSpec.rangeType}
              onChange={(e) => {
                setChartSpec({
                  ...chartSpec,
                  ...DEFAULT_RANGE_TYPES[
                    e.target.value as keyof typeof DEFAULT_RANGE_TYPES
                  ],
                });
              }}
            >
              {Object.keys(DEFAULT_RANGE_TYPES).map((rangeType, idx) => (
                <Radio key={idx} value={rangeType}>
                  {rangeType}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        )}

        {/* Display the specific range editor */}
        {{ ColourScaled, MultiChannel }[chartSpec.rangeType]({
          data,
          specState: specState as any,
        })}
      </Form>
    </div>
  );
}
