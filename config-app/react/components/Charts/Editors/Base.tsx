import { Form, Radio } from "antd";

import { QmsData } from "../../../ts/qmsData";
import { ChartSpec, ChartSpecRT, ColorScaled } from "../../../ts/chartTypes";
import { StateHook } from "../../../ts/hooks";

import TrackMap from "./Domain/TrackMap";
import Line from "./Domain/Line";
import Scatter from "./Domain/Scatter";
import Histogram from "./Domain/Histogram";

import ColorScaledEditor from "./Range/ColorScaled";
import MultiChannelEditor from "./Range/MultiChannel";

export type EditorProps<SpecType> = {
  data: QmsData;
  specState: StateHook<SpecType>;
};

const THROTTLE_POS_CH_IDX = 42;
const GROUND_SPEED_CH_IDX = 44;

const defaultBaseColorScaled = {
  rangeType: "Colour-Scaled",
  nColorBins: 10,
  colorAxis: THROTTLE_POS_CH_IDX
};

const defaultRangeTypes = {
  "Colour-Scaled": {
    ...defaultBaseColorScaled,
    yAxis: GROUND_SPEED_CH_IDX
  },
  "Multi-Channel": {
    rangeType: "Multi-Channel",
    yAxis: []
  }
};

const defaultDomainTypes = {
  "Track-Map": {
    domainType: "Track-Map",
    map: { inner: null, outer: null }, // TODO: populate with real data
    segments: 100,
    ...defaultBaseColorScaled
  },
  Line: {
    domainType: "Line",
    xAxis: "Time",
    ...defaultRangeTypes["Multi-Channel"]
  },
  Scatter: {
    domainType: "Scatter",
    trendline: false,
    xAxis: GROUND_SPEED_CH_IDX,
    ...defaultRangeTypes["Colour-Scaled"]
  },
  Histogram: {
    domainType: "Histogram",
    nBins: 7,
    ...defaultRangeTypes["Multi-Channel"]
  }
};

export default ({ data, specState }: EditorProps<ChartSpec>) => {
  const ColorScaledHelper = () => (
    <ColorScaledEditor
      data={data}
      specState={(specState as unknown) as StateHook<ColorScaled>}
    />
  );
  const [chartSpec, setChartSpec] = specState;
  try {
    ChartSpecRT.check(chartSpec);
  } catch (e) {
    console.error("chartspec failed to validate!\n", chartSpec);
    throw e;
  }
  const [
    ChartDomainRT,
    ChartRangeRT
  ] = ChartSpecRT.alternatives[1].intersectees;

  return (
    <div className="root">
      <style jsx>{`
        .root :global(.ant-form-item) {
          margin-bottom: 0;
        }
      `}</style>
      <Form labelCol={{ xs: { span: 6 } }}>
        <Form.Item label="Chart Type" wrapperCol={{ xs: { span: 18 } }}>
          <Radio.Group
            value={chartSpec.domainType}
            onChange={e => {
              const domainType: keyof typeof defaultDomainTypes =
                e.target.value;
              setChartSpec({
                ...chartSpec,
                ...defaultDomainTypes[domainType]
              } as ChartSpec);
            }}
          >
            {Object.keys(defaultDomainTypes).map((domainType, idx) => (
              <Radio key={idx} value={domainType}>
                {domainType}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        {ChartSpecRT.match(
          trackMapState => (
            <>
              <TrackMap
                data={data}
                specState={
                  (specState as unknown) as StateHook<typeof trackMapState>
                }
              />
              <ColorScaledHelper />
            </>
          ),
          spec => {
            // can't get this thing to work DRYly... :'( and without extreme type ascription >:(
            return (
              <>
                <Form.Item label="Plot Type" wrapperCol={{ xs: { span: 18 } }}>
                  <Radio.Group
                    value={chartSpec.rangeType}
                    onChange={e => {
                      const rangeType: keyof typeof defaultRangeTypes =
                        e.target.value;
                      setChartSpec({
                        ...chartSpec,
                        ...defaultRangeTypes[rangeType]
                      } as ChartSpec);
                    }}
                  >
                    {Object.keys(defaultRangeTypes).map((rangeType, idx) => (
                      <Radio key={idx} value={rangeType}>
                        {rangeType}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>

                {ChartDomainRT.match(
                  lineDomain => (
                    <Line
                      data={data}
                      specState={
                        (specState as unknown) as StateHook<typeof lineDomain>
                      }
                    />
                  ),
                  scatterDomain => (
                    <Scatter
                      data={data}
                      specState={
                        (specState as unknown) as StateHook<
                          typeof scatterDomain
                        >
                      }
                    />
                  ),
                  histogramDomain => (
                    <Histogram
                      data={data}
                      specState={
                        (specState as unknown) as StateHook<
                          typeof histogramDomain
                        >
                      }
                    />
                  )
                )(spec)}

                {ChartRangeRT.match(ColorScaledHelper, multiChannelRange => (
                  <MultiChannelEditor
                    data={data}
                    specState={
                      (specState as unknown) as StateHook<
                        typeof multiChannelRange
                      >
                    }
                  />
                ))(spec)}
              </>
            );
          }
        )(chartSpec)}
      </Form>
    </div>
  );
};
