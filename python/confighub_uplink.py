"""Uploads CANBus data from a serial connection to a CAN-compatible device to the confighub server"""

import asyncio
from asyncio import StreamWriter
import os
from dotenv import load_dotenv
from serial import Serial
import serial
from qev3_can import RemoteHeartBeat, send_can_message, read_can_message

# load environment variables such as "REACT_APP_SANIC_PORT" from the .env
load_dotenv()

TCP_SERVER_PORT = 54353
HOSTNAME = os.environ["REACT_APP_HOSTNAME"]
HEARTBEAT = bytes(RemoteHeartBeat())
BOARD_PORT = "/dev/ttyACM0"

DEMO_MODE = True

async def demo_uplink(writer):
    while True:
        await send_can_message(writer, HEARTBEAT)
        await asyncio.sleep(5)

async def uplink(writer, uart):
    loop = asyncio.get_running_loop()
    
    # TODO: actually get the can messages from serial
    while True:
        try:

            while uart.isOpen():
                # 4 bytes ID blob (29 bits w/ 3 left-pad)
                # + 1 byte data length
                # + up to 8 bytes data
                await loop.run_in_executor(None, uart.read, 13) # makes sync uart.read async

        except (serial.SerialException, TypeError): # typeerror = disconnected, SerialException = no data
            pass

async def demo_downlink(reader):
    while True:
        message = await read_can_message(reader)
        print('Got CAN message from server:', message)

async def downlink(reader, uart):
    if DEMO_MODE:
        while True:
            can_message = await read(reader)
            print('got can message can_message')
    else:
        while True:
            try:

                while uart.isOpen():
                    uart.write(HEARTBEAT)

                    # 4 bytes ID blob (29 bits w/ 3 left-pad)
                    # + 1 byte data length
                    # + 8 bytes data
                    message = uart.read(13)
            except (serial.SerialException, TypeError): # typeerror = disconnected, SerialException = no data
                pass


async def can_uploader():
    reader, writer = await asyncio.open_connection(HOSTNAME, TCP_SERVER_PORT)

    if DEMO_MODE:
        await asyncio.wait([
            demo_uplink(writer),
            demo_downlink(reader)
        ])

    else:
        uart = Serial(BOARD_PORT, baudrate=115200,)
        await asyncio.wait([
            uplink(writer, uart),
            downlink(reader, uart)
        ])



asyncio.run(can_uploader())
