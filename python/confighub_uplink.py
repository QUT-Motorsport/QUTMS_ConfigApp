"""Uploads CANBus data from a serial connection to a CAN-compatible device to the confighub server"""

import asyncio
from asyncio import StreamWriter
import os
from dotenv import load_dotenv
from serial import Serial
import serial
from qev3_can import RemoteHeartBeat
from time import sleep

# load environment variables such as "REACT_APP_SANIC_PORT" from the .env
load_dotenv()

TCP_SERVER_PORT = 54353
HOSTNAME = os.environ["REACT_APP_HOSTNAME"]
HEARTBEAT = bytes(RemoteHeartBeat())
BOARD_PORT = "/dev/ttyACM0"

DEMO_MODE = False

async def send_can_message(stream: StreamWriter, data: bytes):
    size_bytes = len(data).to_bytes(4, byteorder="big")
    stream.writelines([size_bytes, data])
    await stream.drain()


async def can_uploader():
    _reader, writer = await asyncio.open_connection(HOSTNAME, TCP_SERVER_PORT)

    # TODO: actually get the can messages from serial
    if DEMO_MODE:
        while True:
            await send_can_message(writer, HEARTBEAT)
            sleep(5)
    else:
        while True:
            try:
                uart = Serial(BOARD_PORT, baudrate=115200,)

                while uart.isOpen():
                    uart.write(HEARTBEAT)

                    # 4 bytes ID blob (29 bits w/ 3 left-pad)
                    # + 1 byte data length
                    # + 8 bytes data
                    message = uart.read(13)
            except serial.SerialException, TypeError: # typeerror = disconnected, SerialException = no data
                pass



asyncio.run(can_uploader())
