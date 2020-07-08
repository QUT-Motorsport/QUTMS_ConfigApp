import React from "react";
import { Form, Radio, Input } from "antd";

import { QmsData } from "../../../ts/qmsData/types";
import {
  THROTTLE_POS_CH_IDX,
  GROUND_SPEED_CH_IDX,
  WHEEL_SLIP_CH_IDX,
} from "../../../ts/qmsData/constants";
import { AnyChartSpec } from "../AnyChart";
import { StateHook } from "../../../ts/hooks";

import { TrackMapChartSpec } from "../TrackMapChart";
import { LineChartSpec } from "../LineChart";

import TrackMap from "./Domain/TrackMapDomainEditor";
import Line from "./Domain/LineDomainEditor";
import Scatter from "./Domain/ScatterDomainEditor";
import Histogram from "./Domain/HistogramDomainEditor";

import ColourScaledEditor, {
  ContinuouslyColourScaled,
} from "./Range/ColorScaledRangeEditor";
import MultiChannelEditor, {
  MultiChannel,
} from "./Range/MultiChannelRangeEditor";

import styles from "./BaseChartEditor.module.scss";
import { ScatterChartSpec } from "../ScatterChart";
import { HistogramChartSpec } from "../HistogramChart";

export type EditorProps<SpecType> = {
  data: QmsData;
  specState: StateHook<SpecType>;
};

export default function BaseChartEditor({
  data,
  specState,
}: EditorProps<AnyChartSpec>) {
  const [chartSpec, setChartSpec] = specState;
  const channels = data.channels;

  const defaultRanges: {
    ColourScaled: ContinuouslyColourScaled;
    MultiChannel: MultiChannel;
  } = {
    ColourScaled: {
      rangeType: "ColourScaled",
      colourAxis: channels[THROTTLE_POS_CH_IDX],
    },

    MultiChannel: {
      rangeType: "MultiChannel",
      yAxes: [[channels[GROUND_SPEED_CH_IDX]]],
    },
  };

  const defaultCharts = getDefaultCharts(data);

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
                ...defaultCharts[e.target.value as keyof typeof defaultCharts],
              });
            }}
          >
            {Object.keys(defaultCharts).map((domainType, idx) => (
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
                  ...defaultRanges[
                    e.target.value as keyof typeof defaultRanges
                  ],
                } as AnyChartSpec);
              }}
            >
              {Object.keys(defaultRanges).map((rangeType, idx) => (
                <Radio key={idx} value={rangeType}>
                  {rangeType}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        )}

        {/* Display the specific range editor */}
        {{ ColourScaled: ColourScaledEditor, MultiChannel: MultiChannelEditor }[
          chartSpec.rangeType
        ]({
          data,
          specState: specState as any,
        })}
      </Form>
    </div>
  );
}

export function getDefaultCharts({
  channels,
}: QmsData): {
  Line: LineChartSpec;
  Scatter: ScatterChartSpec;
  Histogram: HistogramChartSpec;
  TrackMap: TrackMapChartSpec;
} {
  return {
    Line: {
      title: "Line Chart",
      domainType: "Line",
      xAxis: "Time",
      rangeType: "MultiChannel",
      yAxes: [[channels[GROUND_SPEED_CH_IDX]], [channels[WHEEL_SLIP_CH_IDX]]],
    },

    Scatter: {
      title: "Scatter Chart",
      domainType: "Scatter",
      showTrendline: false,
      xAxis: channels[GROUND_SPEED_CH_IDX],
      rangeType: "ColourScaled",
      colourAxis: channels[THROTTLE_POS_CH_IDX],
      yAxis: channels[WHEEL_SLIP_CH_IDX],
    },

    Histogram: {
      title: "Histogram chart",
      domainType: "Histogram",
      nBins: 7,
      rangeType: "MultiChannel",
      yAxes: [[channels[GROUND_SPEED_CH_IDX]], [channels[WHEEL_SLIP_CH_IDX]]],
    },

    TrackMap: {
      title: "Track Map",
      domainType: "TrackMap",
      map: {
        inner: null as any,
        outer: null as any,
      }, // TODO: populate with real data
      segments: 100,
      rangeType: "ColourScaled",
      colourAxis: channels[THROTTLE_POS_CH_IDX],
    },
  };
}
