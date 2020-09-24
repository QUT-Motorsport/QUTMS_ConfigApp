"""Uploads CANBus data from a serial connection to a CAN-compatible device to the confighub server"""

import asyncio
from asyncio import StreamWriter
import os
from dotenv import load_dotenv
from serial import Serial

CAN_MESSAGE = "hello world".encode()

# load environment variables such as "REACT_APP_SANIC_PORT" from the .env
load_dotenv()

HOSTNAME = os.environ["REACT_APP_HOSTNAME"]
PORT = int(os.environ["REACT_APP_SANIC_PORT"])


async def send_can_message(stream: StreamWriter, data: bytes):
    size_bytes = len(data).to_bytes(4, byteorder="big")
    stream.writelines([size_bytes, data])
    await stream.drain()


async def can_uploader():
    _reader, writer = await asyncio.open_connection(HOSTNAME, PORT)

    print("connected")

    # TODO: actually get the can messages from serial
    await send_can_message(writer, CAN_MESSAGE)


asyncio.run(can_uploader())
