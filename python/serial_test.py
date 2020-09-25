from serial import Serial
import asyncio
from time import sleep

from qev3_can import RemoteHeartBeat

BOARD_PORT = "/dev/ttyACM0"
HEARTBEAT = bytes(RemoteHeartBeat())

uart = Serial(BOARD_PORT, baudrate=115200,)

while uart.isOpen():
    uart.write(HEARTBEAT)

    # 4 bytes ID blob (29 bits w/ 3 left-pad)
    # + 1 byte data length
    # + 8 bytes data
    message = uart.read(13)
    
    print(message)
    sleep()
