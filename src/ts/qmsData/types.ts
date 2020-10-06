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
export enum CanSource {
  External = 0,
  ChassisController = 4,
  Shutdown = 6,
  ShutdownBPSD = 10,
  ShutdownCurrent = 12,
  ShutdownIMD = 14,
  AMS = 16,
  BMS = 18,
  PDM = 20,
  SteeringWheel = 22,
  Charger = 24,
  Sensors = 32,
}

export enum CanMessageType {
  ErrorDetected = 0,
  HeartBeat = 1,
  DataReceive = 2,
  DataTransmit = 3,
}

export enum CanPriority {
  Error = 0,
  Heartbeat = 1,
  Normal = 2,
  Debug = 3,
}

export type CanMessage = {
  priority: CanPriority;
  source: CanSource;
  isAutonomous: boolean;
  type: CanMessageType;
  extraId: number;
  data: Uint8Array;
  sentByConfigHub: boolean;
};

export type TimedCanMessage = CanMessage & {
  time: Date;
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
