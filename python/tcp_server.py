import asyncio
from asyncio import StreamReader, StreamWriter, ensure_future
import os
from dotenv import load_dotenv
import websockets

# load environment variables such as "REACT_APP_SANIC_PORT" from the .env
load_dotenv()

HOSTNAME = os.environ["REACT_APP_HOSTNAME"]
WS_PORT = int(os.environ["REACT_APP_WS_PORT"])
TCP_SERVER_PORT = 54353


can_messages = []
subscribers = set()


async def read_can_message(stream: StreamReader) -> bytes:
    size_bytes = await stream.readexactly(4)
    size = int.from_bytes(size_bytes, byteorder="big")
    data = await stream.readexactly(size)
    return data


async def handle_connection(reader: StreamReader, writer: StreamWriter):
    print('got TCP connection')
    peername = writer.get_extra_info("peername")

    try:
        while True:
            can_message = await read_can_message(reader)
            print('got message: ', can_message, 'subs', subscribers)

            to_remove = set() # for any disconnecting subscribers
            for websocket in subscribers:
                print('sending message to subscriber',)
                try:
                    await websocket.send(can_message)
                except websockets.ConnectionClosed:
                    to_remove.add(websocket)
                    print('websocket subscriber disconnected')
            
            # remove disconnected subscribers
            for websocket in to_remove:
                subscribers.remove(websocket)

    except asyncio.CancelledError:
        print(f"Remote {peername} closing connection.")
        writer.close()
        await writer.wait_closed()
    except asyncio.IncompleteReadError:
        print(f"Remote {peername} disconnected")
    finally:
        print(f"Remote {peername} closed")


async def tcp_server(*args, **kwargs):
    server = await asyncio.start_server(*args, **kwargs)
    async with server:
        await server.serve_forever()

async def websocket_server(websocket, path):
    subscribers.add(websocket)
    print('new websocket subscriber')
    while True: # keep the connection alive
        await asyncio.sleep(60)


async def main():
    print('running TCP & WS servers')
    print('ws server:', HOSTNAME, WS_PORT)
    await asyncio.gather(
        tcp_server(handle_connection, host=HOSTNAME, port=TCP_SERVER_PORT),
        websockets.serve(websocket_server, HOSTNAME, WS_PORT)
    )

try:
    asyncio.run(main())
except KeyboardInterrupt:
    print("Bye!")
