import asyncio
from asyncio import StreamReader, StreamWriter
import os
from dotenv import load_dotenv
import websockets
import pdb
import json
from collections import namedtuple

from qev3_can import read_tcp_msg, send_tcp_msg

# load environment variables such as "REACT_APP_SANIC_PORT" from the .env
load_dotenv()

HOSTNAME = os.environ["REACT_APP_HOSTNAME"]
WS_PORT = int(os.environ["REACT_APP_WS_PORT"])
TCP_SERVER_PORT = 54353

TCP_Connection = namedtuple('TCPConnection', ('reader', 'writer', 'ws_subs'))

tcp_clients = {} # { TCP_Connection: peername }
ws_clients = {} # { websocket: TCP_Connection } 

def ws_disconnect(websocket):
    if ws_clients[websocket]:
        ws_clients[websocket].ws_subs.remove(websocket)
        del ws_clients[websocket]

async def send_available_boards(websocket):
    await websocket.send(json.dumps({
        'availableBoards': list(tcp_clients.keys())
    }))

async def broadcast_available_boards():
    await send_all_ws(ws_clients, json.dumps({
        'availableBoards': list(tcp_clients.keys())
    }))
    print('broadcasting available boards', ws_clients)


async def send_all_ws(clients, message):
    if any(clients):
        websockets = list(clients)
        results = await asyncio.gather(
             *[websocket.send(message) for websocket in websockets],
             return_exceptions=True)

        # remove disconnected clients
        for idx, res in enumerate(results):
            if isinstance(res, Exception):
                ws_disconnect(websockets[idx])


async def handle_tcp_conn(reader: StreamReader, writer: StreamWriter):
    [ip, port] = writer.get_extra_info("peername")
    peername = f'{ip}:{port}'
    ws_subs = set()
    tcp_clients[peername] = TCP_Connection(reader, writer, ws_subs)

    await broadcast_available_boards()

    try:
        while True:
            can_message = await read_tcp_msg(reader)
            print('got CAN message: ', can_message, 'from', peername)
            await send_all_ws(ws_subs, can_message)


    except asyncio.CancelledError:
        print(f"Remote {peername} closing connection.")
        writer.close()
        await writer.wait_closed()
        del tcp_clients[peername]
    except asyncio.IncompleteReadError:
        print(f"Remote {peername} disconnected")
        del tcp_clients[peername]
    finally:
        await broadcast_available_boards()
        print(f"Remote {peername} closed")


async def tcp_server(*args, **kwargs):
    server = await asyncio.start_server(*args, **kwargs)
    async with server:
        await server.serve_forever()


async def websocket_server(websocket, path):
    chosen_board = None
    print('got ws client', websocket)
    ws_clients[websocket] = None

    try:
        # let client know which boards are available
        await send_available_boards(websocket)
        print('sent available boards')
        
        while True:
            new_msg = await websocket.recv()
            print('got message', new_msg)
            try:
                # this should happen first, can messages shouldn't tranceive until so
                chosen_board_peername = json.loads(new_msg)['chosenBoard']
                chosen_board = next(client for peername, client in tcp_clients.items() \
                    if peername == chosen_board_peername)

                # disconnect and reconnect to newly chosen board
                ws_disconnect(websocket)
                ws_clients[websocket] = chosen_board
                ws_clients[websocket].ws_subs.add(websocket)
                
            except (UnicodeDecodeError, json.JSONDecodeError):
                print('sending to ', chosen_board_peername)
                await send_tcp_msg(chosen_board.writer, new_msg)
                print('sent')
    except websockets.ConnectionClosed:
        if websocket in ws_clients:
            ws_disconnect(websocket)

async def main():
    print('running TCP & WS servers')
    print(f'TCP server: {HOSTNAME}:{TCP_SERVER_PORT}')
    print(f'ws server: {HOSTNAME}:{WS_PORT}')
    await asyncio.wait([
        tcp_server(handle_tcp_conn, host=HOSTNAME, port=TCP_SERVER_PORT),
        websockets.serve(websocket_server, HOSTNAME, WS_PORT)
    ])

if __name__ == '__main__':
    asyncio.run(main())
