import React, { useEffect, useState, useRef } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import classNames from "classnames";
import { Button, Col, Row, Table, Typography, Form } from "antd";
import { TableProps } from "antd/lib/table";
import HexEditor from "react-hex-editor";

import { useTitle } from "./_helpers";
import styles from "./DebugPage.module.scss";
import { CanMessage } from "../ts/qmsData/types";

const { Title } = Typography;

// function usePingPong(): CanMessage[] {
//   const [canMsgs, setCanMsgs] = useState<CanMessage[]>([]);

//   useEffect(() => {
//     const id = setInterval(() => {
//       setCanMsgs([
//         {
//           // ping
//           time: new Date(),
//           canId: new Uint8Array(4),
//           // source: CanSource.External,
//           // type: CanMessageType.DataTransmit,
//           // is_autonomous: false,
//           // external_id: 0,
//           data: new TextEncoder().encode("Hey Sexy"),
//         },
//         ...canMsgs,
//       ]);

//       setTimeout(() => {
//         setCanMsgs((canMsgs) => [
//           {
//             // pong
//             time: new Date(),
//             canId: new Uint8Array(4),
//             // source: CanSource.ChassisController,
//             // type: CanMessageType.DataReceive,
//             // is_autonomous: false,
//             // external_id: 0,
//             data: new TextEncoder().encode("Hey you"),
//           },
//           ...canMsgs,
//         ]);
//       }, 100);
//     }, 2000);

//     return () => clearInterval(id);
//   });

//   return canMsgs;
// }

function useLiveCanMsgs() {
  const [canMsgs, setCanMsgs] = useState<CanMessage[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const address = `ws://localhost:${process.env.REACT_APP_WS_PORT}`;
    console.log(address);
    const ws = new WebSocket(address);
    console.log(ws);
    ws.onopen = () => {
      setConnected(true);
      console.log("connected");
      ws.onmessage = async ({ data: rawCanMsg }) => {
        console.log("onmessage");
        const buffer = await new Response(rawCanMsg).arrayBuffer();
        console.log("got new msg", rawCanMsg);
        setCanMsgs((canMsgs) => [
          {
            time: new Date(),
            canId: new Uint8Array(buffer.slice(0, 5)),
            // source: CanSource.ChassisController,
            // type: CanMessageType.DataReceive,
            // is_autonomous: false,
            // external_id: 0,
            data: new Uint8Array(buffer.slice(0, 5)),
          },
          ...canMsgs,
        ]);
      };
    };

    ws.onclose = () => {
      console.log("ws closed");
      setConnected(false);
    };
  }, []);

  return { canMsgs, connected };
}

export default function DebugPage() {
  useTitle("CAN Debugger");

  console.log("render");

  const { canMsgs, connected } = useLiveCanMsgs();
  const [newMsg, setNewMsg] = useState<Partial<CanMessage>>({
    canId: new Uint8Array(4),
    data: new Uint8Array(8),
  });

  return (
    <div className={styles["debug-page"]}>
      <Row>
        <Title className={"title"}>
          CAN Debugger {`connected?: ${connected}`}
        </Title>
      </Row>
      <Row>
        <Col span={14}>
          <VirtualTable
            scroll={{ y: 500, x: 0 }}
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
                width: 100,
              },
              {
                title: "CAN ID",
                dataIndex: "canId",
                key: "canId",
                width: 120,
                render: (id) => (
                  <HexEditor
                    className={styles["hex-editor"]}
                    columns={4}
                    data={id}
                  />
                ),
              },
              // TODO: use this instead of canId once it becomes standard
              //  {
              //     title: 'Source',
              //     dataIndex: 'source',
              //     key: 'source',
              //     render: source => CanSource[source]
              // }, {
              //     title: 'Message Type',
              //     dataIndex: 'type',
              //     key: 'type',
              //     render: type => CanMessageType[type]
              // }, {
              //     title: 'Autonomous?',
              //     dataIndex: 'is_autonomous',
              //     key: 'is_autonomous'
              // }, {
              //     title: 'Ext.ID',
              //     dataIndex: 'external_id',
              //     key: 'external_id'
              // },
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
                    showAscii={true}
                  />
                ),
              },
            ]}
            dataSource={canMsgs.map((msg, idx) => ({
              key: idx,
              ...msg,
            }))}

            // colour the row red if it's an error
            // rowClassName={(msg: CanMessage) =>
            //     msg.type === CanMessageType.ErrorDetected ? "error-type" : ""}
          />
        </Col>

        <Col span={10}>
          <h1>New Message:</h1>

          <Form labelCol={{ xs: { span: 6 } }}>
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
              />
            </Form.Item>

            <Form.Item
              label="Data"
              wrapperCol={{ xs: { span: 18 }, sm: { span: 11 } }}
            >
              <HexEditor
                className={styles["hex-editor"]}
                columns={8}
                height={30}
                width={300}
                data={newMsg.data}
                showAscii={true}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 7 }}>
              <Button>Send</Button>
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
