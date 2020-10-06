"""Uploads CANBus data from a serial connection to a CAN-compatible device to the confighub server"""

import asyncio
from asyncio import StreamWriter
import os
from dotenv import load_dotenv
from serial import Serial
import serial
from qev3_can import send_tcp_msg, read_tcp_msg
import codecs

# load environment variables such as "REACT_APP_SANIC_PORT" from the .env
load_dotenv()

TCP_SERVER_PORT = 54353
HOSTNAME = "172.19.14.205"
DEMO_MSG = bytes((0x0, 0x0, 0x0, 0x45, 0x68, 0x65, 0x79, 0x20, 0x73, 0x65, 0x78, 0x79))
BOARD_PORT = "/dev/ttyACM0"

DEMO_MODE = True


async def demo_uplink(writer):
    while True:
        await send_tcp_msg(writer, DEMO_MSG)
        await asyncio.sleep(5)


async def uplink(writer, uart):
    loop = asyncio.get_running_loop()

    while True:
        try:

            while uart.isOpen():
                # 4 bytes ID blob (29 bits w/ 3 left-pad)
                # + 1 byte data length
                # + up to 8 bytes data
                can_message = await loop.run_in_executor(
                    None, uart.read, 13
                )  # makes sync uart.read async
                print("uploading can_message", can_message)
                await send_tcp_msg(writer, can_message)

        except (
            serial.SerialException,
            TypeError,
        ):  # typeerror = disconnected, SerialException = no data
            pass


async def demo_downlink(reader):
    while True:
        message = await read_tcp_msg(reader)
        print("Got CAN message from server:", message)


async def downlink(reader, uart):
    loop = asyncio.get_running_loop()
    if DEMO_MODE:
        while True:
            can_message = await read_tcp_msg(reader)
            print("got can message can_message", can_message)
    else:
        while True:
            try:

                while uart.isOpen():
                    # 4 bytes ID blob (29 bits w/ 3 left-pad)
                    # + 1 byte data length
                    # + up to 8 bytes data
                    can_message = await loop.run_in_executor(
                        None, uart.read, 13
                    )  # makes sync uart.read async
                    print("uploading can_message", can_message)
                    can_message = await read_tcp_msg(reader)
                    uart.write(can_message)
            except (
                serial.SerialException,
                TypeError,
            ):  # typeerror = disconnected, SerialException = no data
                pass


async def can_uploader():
    reader, writer = await asyncio.open_connection(HOSTNAME, TCP_SERVER_PORT)

    if DEMO_MODE:
        await asyncio.wait([demo_uplink(writer), demo_downlink(reader)])

    else:
        uart = Serial(BOARD_PORT, baudrate=115200,)
        await asyncio.wait([uplink(writer, uart), downlink(reader, uart)])


asyncio.run(can_uploader())
