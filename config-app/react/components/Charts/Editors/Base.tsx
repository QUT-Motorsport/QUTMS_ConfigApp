import { Form, Radio } from "antd";

import { QmsData } from "../../../ts/qmsData";
import { ChartSpec, ChartSpecRT, ColorScaled } from "../../../ts/chartTypes";
import { StateHook } from "../../../ts/hooks";
import { defaultRangeTypes, defaultCharts } from "../../../ts/defaults";

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
              const domainType: keyof typeof defaultCharts = e.target.value;
              setChartSpec({
                ...chartSpec,
                ...defaultCharts[domainType]
              } as ChartSpec);
            }}
          >
            {Object.keys(defaultCharts).map((domainType, idx) => (
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
          spec => (
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
                      (specState as unknown) as StateHook<typeof scatterDomain>
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
          )
        )(chartSpec)}
      </Form>
    </div>
  );
};
