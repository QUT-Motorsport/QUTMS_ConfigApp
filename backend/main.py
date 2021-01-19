from quart import Quart, websocket

# import mysql.connector

from quart_cors import cors

app = Quart(__name__)

# To allow an app to be used from any origin (not recommended as it is too permissive)
# https://pypi.org/project/Quart-CORS/
# app = cors(app, allow_origin="*")

# config = {
#     "user": "root",
#     "password": "sqlroot",
#     "host": "db",
#     "port": "3306",
#     "database": "qutmslogins",
# }
# connection = mysql.connector.connect(**config)


@app.route("/")
async def hello():
    return "hello"


# @app.route("/registration", methods=["GET"])
# async def registration():
#     # email = request.headers["email"]
#     # username = request.headers["username"]
#     # password = request.headers["password"]
#     # print(email)
#     # print(username)
#     # print(password)
#     return "Registered"


@app.websocket("/ws")
async def ws():
    while True:
        await websocket.send("hello")


app.run(host="0.0.0.0", port="5873")
