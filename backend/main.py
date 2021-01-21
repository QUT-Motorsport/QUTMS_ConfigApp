from quart import Quart, websocket

# import mysql.connector

import quart_cors

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


## unsure if this code should be here, if not place it appropriately

#handle login request from server side

def loginRequest(username, inputPassword):
    try{
        #probably incorrect syntax for the query below, will fix later
        dbQuery = "SELECT salt, password FROM users WHERE username='%s'", username"
        #resultOfQuery = someFunction(dbquery) # unsure what python uses, Java has SQLQueryInterface package with .query function

        #something on the lines of this
        #import sqlite3
        #connection = sqlite3.connect("survey.db")
        #cursor = connection.cursor()
        #cursor.execute("SELECT Site.lat, Site.long FROM Site;")
        #results = cursor.fetchall()
        #cursor.close()
        #connection.close()
        #
        #
        salt = decode(result[0])
        password = decode(result[1])

        return compareHash(password, inputPassword, salt) # this function is in crypto.py
    }
    catch(Exception e) {
        return False
    }
