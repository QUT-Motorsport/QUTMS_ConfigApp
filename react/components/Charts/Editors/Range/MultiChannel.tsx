import { Form, Select, Button, Icon } from "antd";
import { EditorProps } from "../Base";
import { Channel } from "../../../../ts/qmsData";
import { MultiChannel } from "../../../../ts/chart/types";
import { channelOptionAttrs } from "./_helpers";

export default ({
  data,
  specState: [spec, setSpec]
}: EditorProps<MultiChannel>) => (
  <div className="root">
    <style jsx>{`
      .root :global(.select-channels) {
        width: calc(100% - 55px); // enable room for delete button
      }
    `}</style>
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
            value={yAxis}
            onChange={(channelIdxs: MultiChannel["yAxes"][0]) => {
              spec.yAxes[idx] = channelIdxs;
              setSpec({ ...spec });
            }}
          >
            {data.channels.map((channel, idx) => (
              <Select.Option {...channelOptionAttrs(channel as Channel, idx)} />
            ))}
          </Select>
          {idx > 0 ? (
            <Button
              style={{ marginLeft: 5 }}
              type="danger"
              onClick={() => {
                spec.yAxes.splice(idx, 1);
                setSpec({ ...spec });
              }}
            >
              <Icon type="delete" />
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
