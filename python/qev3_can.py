from enum import IntEnum
from abc import ABC
from typing import Optional
import struct


class Priority(IntEnum):
    Error = 0
    HeartBeat = 1
    Normal = 2


class Source(IntEnum):
    External = 0
    ChassisController = 4
    Shutdown = 6
    ShutdownBPSD = 10
    ShutdownCurrent = 12
    ShutdownIMD = 14
    AMS = 16
    BMS = 18
    PDM = 20
    SteeringWheel = 22
    Charger = 24
    Sensors = 32


class MessageType(IntEnum):
    ErrorDetected = 0
    HeartBeat = 1
    DataReceive = 2
    DataTransmit = 3


class CanMsg(ABC):
    priority: Priority
    source: Source
    is_autonomous: bool
    type: MessageType
    external_id: Optional[int] = None
    data: Optional[bytes] = None

    def __bytes__(self):
        return struct.pack(
            "BBBbp",  # B = uint8, b = int8, p = string with single-byte length header
            self.priority,
            self.source,
            self.type,
            0 if self.external_id is None else self.external_id,
            b"" if self.data is None else self.data,
        )


class RemoteHeartBeat(CanMsg):
    priority = Priority.HeartBeat
    source = Source.External
    is_autonomous = True
    type = MessageType.HeartBeat
