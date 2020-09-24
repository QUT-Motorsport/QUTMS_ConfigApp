import asyncio
from asyncio import StreamReader, StreamWriter
import os
from dotenv import load_dotenv

HOSTNAME = os.environ["REACT_APP_HOSTNAME"]
PORT = int(os.environ["REACT_APP_SANIC_PORT"])

# load environment variables such as "REACT_APP_SANIC_PORT" from the .env
load_dotenv()

can_messages = []


async def read_can_message(stream: StreamReader) -> bytes:
    size_bytes = await stream.readexactly(4)
    size = int.from_bytes(size_bytes, byteorder="big")
    data = await stream.readexactly(size)
    return data


async def handle_connection(reader: StreamReader, writer: StreamWriter):

    peername = writer.get_extra_info("peername")

    try:
        while True:
            can_message = await read_can_message(reader)
            can_messages.append(can_message)
            # TODO: send to telemetry clients over websockets

    except asyncio.CancelledError:
        print(f"Remote {peername} closing connection.")
        writer.close()
        await writer.wait_closed()
    except asyncio.IncompleteReadError:
        print(f"Remote {peername} disconnected")
    finally:
        print(f"Remote {peername} closed")


async def main(*args, **kwargs):
    server = await asyncio.start_server(*args, **kwargs)
    async with server:
        await server.serve_forever()


try:
    asyncio.run(main(handle_connection, host=HOSTNAME, port=PORT))
except KeyboardInterrupt:
    print("Bye!")
