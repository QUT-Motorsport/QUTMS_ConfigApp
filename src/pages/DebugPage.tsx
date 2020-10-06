import React, { useEffect, useState, useRef } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import classNames from "classnames";
import {
  Button,
  Col,
  Row,
  Table,
  Typography,
  Form,
  Slider,
  InputNumber,
  Checkbox,
  Divider,
  Dropdown,
  Menu,
} from "antd";
import { TableProps } from "antd/lib/table";
import { DownOutlined } from "@ant-design/icons";
import HexEditor from "react-hex-editor";
// @ts-ignore
import arrayBufferConcat from "arraybuffer-concat";

import { useTitle } from "./_helpers";
import styles from "./DebugPage.module.scss";
import {
  CanMessage,
  CanMessageType,
  CanSource,
  CanPriority,
  TimedCanMessage,
} from "../ts/qmsData/types";
import { serverIp } from "../ts/ajax";

const { Title, Link } = Typography;
const NO_CHOSEN_BOARD = "None";

type CanMsgWithId = CanMessage & { canId: Uint8Array };

function withCanId(canMsg: CanMessage | CanMsgWithId): CanMsgWithId {
  const canId = new Uint8Array(4);
  new DataView(canId.buffer).setUint32(
    0,
    (canMsg.priority << 27) |
      (canMsg.source << 18) |
      ((canMsg.isAutonomous ? 1 : 0) << 17) |
      (canMsg.type << 14) |
      canMsg.extraId,
    false
  );

  return { ...canMsg, canId };
}

function fromCanId(
  canMsg: Pick<CanMsgWithId, "canId" | "data"> | CanMsgWithId
): CanMsgWithId {
  const canId = Buffer.from(canMsg.canId).readUInt32BE(0);

  function extract(offset: number, width: number) {
    // behold - bit wizardry!
    return (
      (canId >> offset) & // shift the bits to be at 0
      (Math.pow(2, width) - 1)
    ); // & with a variable width rightmost-mask
  }

  return {
    ...canMsg,
    priority: extract(27, 2),
    source: extract(18, 9),
    isAutonomous: !!extract(17, 1),
    type: extract(14, 3),
    extraId: extract(0, 14),
    sentByConfigHub: "sentByConfigHub" in canMsg && canMsg.sentByConfigHub,
  };
}

function useLiveCanMsgs() {
  const [canMsgs, setCanMsgs] = useState<TimedCanMessage[]>([]);
  const [availableBoards, setAvailableBoards] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [chosenBoard, setChosenBoard] = useState<string>(NO_CHOSEN_BOARD);
  const chosenBoardRef = useRef<string | null>(chosenBoard);
  chosenBoardRef.current = chosenBoard; // to bypass useEffect closure

  useEffect(() => {
    const address = `ws://${serverIp}:${process.env.REACT_APP_WS_PORT}`;
    const ws = new WebSocket(address);
    ws.onopen = () => {
      setWs(ws);
      console.log("ws open");
    };

    ws.onmessage = async ({ data }) => {
      try {
        // check first to see if this is a json message with an updated availableBoards
        const { availableBoards } = JSON.parse(data);
        console.log("got available boards", availableBoards);
        setAvailableBoards(availableBoards);

        if (!availableBoards.includes(chosenBoardRef.current)) {
          setChosenBoard(NO_CHOSEN_BOARD);
          setCanMsgs([]);
        }
      } catch (err) {
        if (err instanceof SyntaxError) {
          // JSON parse errors
          // this should be a raw can message
          const buffer = await new Response(data).arrayBuffer();
          setCanMsgs((canMsgs) =>
            canMsgs.concat([
              {
                time: new Date(),
                ...fromCanId({
                  canId: new Uint8Array(buffer.slice(0, 4)),
                  // source: CanSource.ChassisController,
                  // type: CanMessageType.DataReceive,
                  // isAutonomous: false,
                  // extraId: 0,
                  data: new Uint8Array(buffer.slice(5)),
                }),
              },
            ])
          );
        } else throw err;
      }
    };

    ws.onclose = () => {
      setWs(null);
      console.log("ws closed");
      // TODO: try to reconnect (forever) here
    };
    return ws.close;
  }, []);

  return {
    canMsgs,
    setCanMsgs,
    ws,
    availableBoards,
    chosenBoard,
    setChosenBoard: (newChoice: string) => {
      if (newChoice !== NO_CHOSEN_BOARD) {
        ws!.send(JSON.stringify({ chosenBoard: newChoice }));
      }
      if (newChoice !== chosenBoard) {
        setChosenBoard(newChoice);
        setCanMsgs([]);
      }
    },
  };
}

export default function DebugPage() {
  useTitle("CAN Debugger");

  const {
    canMsgs,
    ws,
    setCanMsgs,
    availableBoards,
    chosenBoard,
    setChosenBoard,
  } = useLiveCanMsgs();
  const [newMsg, setNewMsg] = useState<CanMsgWithId>(() =>
    withCanId({
      priority: CanPriority.Debug,
      source: CanSource.External,
      type: CanMessageType.DataReceive,
      isAutonomous: false,
      extraId: 1,
      sentByConfigHub: true,
      data: new Uint8Array(8),
    })
  );
  const [rawView, setRawView] = useState<boolean>(false);

  function handleDataLengthChange(newLength: number) {
    if (newLength !== newMsg.data.length) {
      // TODO: don't hardcode 8 here
      newMsg.data = new Uint8Array(newLength);
      newMsg.data.set(newMsg.data.slice(8 - newLength));
      setNewMsg({ ...newMsg });
    }
  }

  function getHexEditorSetHandle(target: Uint8Array) {
    return (offset: number, value: number) => {
      // update the underlying data and trigger a re-render.
      target[offset] = value;
      setNewMsg({ ...newMsg });
    };
  }

  function NewMsgDropdown({
    attr,
    enumerable,
  }: {
    attr: keyof CanMessage;
    enumerable: any;
  }) {
    return (
      <Dropdown
        overlay={
          <Menu
            onClick={({ key: newVal }) =>
              setNewMsg(withCanId({ ...newMsg, [attr]: newVal }))
            }
          >
            {Object.entries(enumerable)
              .filter(([opt]) => isNaN(opt as any))
              .map(([opt, val]) => (
                <Menu.Item key={val as number}>{opt}</Menu.Item>
              ))}
          </Menu>
        }
      >
        <Button>
          {enumerable[newMsg[attr] as number]} <DownOutlined />
        </Button>
      </Dropdown>
    );
  }

  return (
    <div className={styles["debug-page"]}>
      <Row>
        <Col span={14}>
          <Row>
            <Title className={"title"}>
              CAN Debugger (connected: {ws ? "yes" : "no"})
            </Title>
            <Link href="/confighub_uplink.py" download style={{ marginTop: 40 }}>
              Get Upload Script
            </Link>
          </Row>
          <Row>
            <Form layout="inline">
              <Form.Item name="chosenBoard" label="Connected Board">
                <Dropdown
                  overlay={
                    <Menu onClick={({ key: board }) => setChosenBoard(board)}>
                      {[NO_CHOSEN_BOARD, ...availableBoards].map((board) => (
                        <Menu.Item key={board}>{board}</Menu.Item>
                      ))}
                    </Menu>
                  }
                >
                  <Button>
                    {chosenBoard} <DownOutlined />
                  </Button>
                </Dropdown>
              </Form.Item>

              <Form.Item name="rawView">
                <Checkbox
                  checked={rawView}
                  onChange={(e) => setRawView(e.target.checked)}
                >
                  View Raw?
                </Checkbox>
              </Form.Item>
            </Form>
          </Row>
          <Row>
            <VirtualTable
              scroll={{ y: 350, x: 0 }}
              columns={[
                {
                  title: "Time",
                  dataIndex: "time",
                  key: "time",
                  render: (time: Date) =>
                    new Intl.DateTimeFormat("en", {
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })
                      .format(time)
                      .split(" ")[0],
                  width: 70,
                },

                ...(rawView
                  ? [
                      {
                        title: "Raw CAN ID",
                        dataIndex: "canId",
                        key: "canId",
                        width: 130,
                        render: (id: Uint8Array) => (
                          <HexEditor
                            className={styles["hex-editor"]}
                            columns={4}
                            data={id}
                          />
                        ),
                      },
                    ]
                  : [
                      {
                        title: "Priority",
                        dataIndex: "priority",
                        key: "priority",
                        render: (priority: CanPriority) =>
                          CanPriority[priority],
                        width: 80,
                      },
                      {
                        title: "Source",
                        dataIndex: "source",
                        key: "source",
                        render: (source: CanSource) => CanSource[source],
                        width: 100,
                      },
                      {
                        title: "Msg Type",
                        dataIndex: "type",
                        key: "type",
                        render: (type: CanMessageType) => CanMessageType[type],
                        width: 110,
                      },
                      {
                        title: "Auto?",
                        dataIndex: "isAutonomous",
                        key: "isAutonomous",
                        render: (isAutonomous: boolean) =>
                          isAutonomous ? "yes" : "no",
                        width: 70,
                      },
                      {
                        title: "Extra ID",
                        dataIndex: "extraId",
                        key: "extraId",
                        width: 60,
                      },
                    ]),

                // TODO: use this instead of canId once it becomes standard
                {
                  title: "Data",
                  dataIndex: "data",

                  key: "data",
                  width: 180,
                  render: (data: Uint8Array) => (
                    <HexEditor
                      className={styles["hex-editor"]}
                      columns={8}
                      data={data}
                    />
                  ),
                },
              ]}
              dataSource={canMsgs.reverse().map((msg, idx) => ({
                key: idx,
                ...msg,
              }))}

              // colour the row red if it's an error
              // rowClassName={(msg: CanMessage) =>
              //     msg.type === CanMessageType.ErrorDetected ? "error-type" : ""}
            />
          </Row>
        </Col>

        <Col span={10}>
          <h1>New Message:</h1>

          <Form labelCol={{ xs: { span: 6 } }}>
            {rawView ? (
              <Form.Item
                label="CAN ID"
                wrapperCol={{ xs: { span: 18 }, sm: { span: 11 } }}
              >
                <HexEditor
                  className={styles["hex-editor"]}
                  columns={4}
                  data={newMsg.canId}
                  height={30}
                  width={110}
                  onSetValue={getHexEditorSetHandle(newMsg.canId)}
                />
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  label="Priority"
                  wrapperCol={{ xs: { span: 18 }, sm: { span: 11 } }}
                >
                  <NewMsgDropdown attr="priority" enumerable={CanPriority} />
                </Form.Item>

                <Form.Item
                  label="Type"
                  wrapperCol={{ xs: { span: 18 }, sm: { span: 11 } }}
                >
                  <NewMsgDropdown attr="type" enumerable={CanPriority} />
                </Form.Item>

                <Form.Item
                  label="Source"
                  wrapperCol={{ xs: { span: 18 }, sm: { span: 11 } }}
                >
                  <NewMsgDropdown attr="source" enumerable={CanSource} />
                </Form.Item>

                <Form.Item
                  label="Extra ID"
                  wrapperCol={{ xs: { span: 18 }, sm: { span: 11 } }}
                >
                  <InputNumber
                    min={0}
                    max={Math.pow(2, 14) - 1} // TODO: don't hardcode 14
                    style={{ margin: "0 16px" }}
                    value={newMsg.extraId}
                    onChange={(extraId) =>
                      setNewMsg(
                        withCanId({ ...newMsg, extraId: extraId as number })
                      )
                    }
                  />
                </Form.Item>
              </>
            )}

            <Divider />

            <Form.Item
              label="Data Length"
              wrapperCol={{ xs: { span: 18 }, sm: { span: 11 } }}
            >
              <Row>
                <Col span={19}>
                  <Slider
                    min={0}
                    max={8}
                    onChange={handleDataLengthChange as any}
                    value={newMsg.data.length}
                  />
                </Col>

                <Col span={5}>
                  <InputNumber
                    min={0}
                    max={8}
                    style={{ margin: "0 16px", width: 60 }}
                    value={newMsg.data.length}
                    onChange={handleDataLengthChange as any}
                  />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label="Data"
              wrapperCol={{ xs: { span: 18 }, sm: { span: 11 } }}
            >
              <HexEditor
                className={styles["hex-editor"]}
                columns={newMsg.data.length}
                height={30}
                width={200}
                data={newMsg.data}
                onSetValue={getHexEditorSetHandle(newMsg.data)}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 7 }}>
              <Button
                disabled={!ws}
                onClick={() => {
                  const toSend = arrayBufferConcat(
                    newMsg.canId,
                    new Uint8Array([newMsg.data.length]),
                    newMsg.data
                  );
                  if (chosenBoard !== NO_CHOSEN_BOARD) {
                    console.log("sending", new Uint8Array(toSend));
                    ws!.send(toSend);
                    console.log("sent!");
                  }
                  console.log("new can Msgs");
                  setCanMsgs(canMsgs.concat([{ time: new Date(), ...newMsg }]));
                }}
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

function VirtualTable(props: TableProps<CanMessage>) {
  const { columns, scroll }: any = props;
  const [tableWidth, setTableWidth] = useState(0);

  const widthColumnCount = columns.filter(({ width }: any) => !width).length;
  const mergedColumns = columns.map((column: any) => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const gridRef = useRef<any>();
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, "scrollLeft", {
      get: () => null,
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.resetAfterIndices({
        columnIndex: 0,
        shouldForceUpdate: false,
      });
    }
  }, [tableWidth]);

  const renderVirtualList = (
    rawData: any[],
    { scrollbarSize, ref, onScroll }: any
  ) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 54;

    return (
      <Grid
        ref={gridRef}
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index];
          return totalHeight > scroll.y && index === mergedColumns.length - 1
            ? width - scrollbarSize - 1
            : width;
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }: any) => onScroll({ scrollLeft })}
      >
        {function renderCell({ columnIndex, rowIndex, style }: any) {
          const column = mergedColumns[columnIndex];
          const value = rawData[rowIndex][column.dataIndex];

          return (
            <div
              className={classNames(styles["virtual-table-cell"], {
                [styles["virtual-table-cell-last"]]:
                  columnIndex === mergedColumns.length - 1,
                [styles["sent-by-config-hub"]]:
                  rawData[rowIndex].sentByConfigHub,
              })}
              style={style}
            >
              {column.render ? column.render(value) : value}
            </div>
          );
        }}
      </Grid>
    );
  };

  return (
    <ResizeObserver onResize={({ width }) => setTableWidth(width)}>
      <Table
        {...props}
        className={styles["virtual-table"]}
        columns={mergedColumns}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
}
