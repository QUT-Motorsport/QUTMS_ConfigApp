from serial import Serial
import asyncio
from time import sleep

from qev3_can import RemoteHeartBeat

BOARD_PORT = "/dev/ttyACM0"
HEARTBEAT = bytes(RemoteHeartBeat())

uart = Serial(BOARD_PORT, baudrate=115200,)

while uart.isOpen():
    uart.write(HEARTBEAT)
    message = uart.read(20)
    print(message)
    sleep()
