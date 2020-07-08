// object acts as both the file interface and a cache for channel data
export type QmsData = {
  filename: string;

  channels: (ChannelHeader | Channel)[]; // just the header if un-hydrated

  maxTime: null | Time; // null before any channels have been hydrated

  messages: CanMessage[];
};

/**
 * The source of the CAN message. Mirrors the spec:
 * https://www.overleaf.com/project/5efbfadab78c5f00018eabff
 */
enum CanSource {
  ExternalMaster = 0x00, // - 0x03
  ChassisController = 0x04, // - 0x05
  Amu = 0x06, // - 0x07
  Shutdown = 0x08, // - 0xB
  Pdm = 0x0c, // - 0x0F
  SteeringWheel = 0x10, // - 0x11
  Dashboard = 0x12, // - 0x13
  // Sensors = ???
  // Bms = ???
}

enum CanMessageType {
  Heartbeat = 0x01,
  DataRequest = 0x02,
  DataResponse = 0x03,
  DataStream = 0x04,
}

export type CanMessage = {
  time: Time;
  type: CanMessageType;
  source: CanSource;
};

export type ChannelHeader = {
  idx: ChannelIdx;
  name: string;
  freq: number;
  unit: string;
};

export type ChannelIdx = number;

export type Channel = ChannelHeader & {
  data: Data;
  minMax: Range;
};

export type Time = number;
export type Datum = number; // singular of data (a single point)
export type Data = Datum[];
export type Range<T = Datum> = [T, T];
