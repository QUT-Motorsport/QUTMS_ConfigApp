from sanic import Sanic
from sanic.response import json
from sanic import response as res
from sanic_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
from motec.ldparser import read_ldfile
import asyncio as aio
import glob

from tcp_server import main as tcp_server

# load environment variables such as "REACT_APP_SANIC_PORT" from the .env
load_dotenv()
FILE_DIR = Path(__file__).parent
head, channels = read_ldfile(FILE_DIR / "Sample.ld")

app = Sanic(__name__)
# Allow react app being served off another port (react app) to access sanic
CORS(app, automatic_options=True)

config = {}
config["upload"] = "./uploads"


# run ldparser
@app.route("/fileSelect", methods=["GET"])
async def fileSelect_handler(request):
    filename = request.headers["filename"]
    return res.text("asd")


# get file list
@app.route("/fileList", methods=["GET"])
async def fileList_handler(request):
    filelist = glob.glob(config["upload"] + "/*.ld")
    return res.json(filelist)


@app.route("/confighub_uplink.py")
async def confighub_uplink(request):
    return await res.file(str(FILE_DIR / "confighub_uplink.py"))


# upload files
@app.route("/uploadFile", methods=["POST"])
async def upload_handler(request):
    if not os.path.exists(config["upload"]):
        os.makedirs(config["upload"])
    up_file = request.files.get("uploadFile")

    file_path = f"{config['upload']}/{up_file.name}"
    with open(file_path, "wb") as f:
        f.write(up_file.body)
    f.close()
    filelist = glob.glob(config["upload"] + "/*.ld")
    print("file wrote to disk")
    print(request)

    return json({"received": True, "success": True, "filelist": filelist})


# TODO: actually use the filename to select the data
@app.get("/qms/<filename:path>/<channel_idx:int>")
async def get_qms_channel_data(req, filename, channel_idx):
    # TODO: Don't json-serialize. it's too expensive
    return json(channels[channel_idx].data.tolist())


@app.get("/qms/<filename:path>")
async def get_qms_headers(req, filename):
    return json(
        {
            "totalTime": 0,
            "lapTimes": [],
            "channels": [
                {"name": ch.name, "freq": int(ch.freq), "unit": ch.unit}
                for ch in channels
            ],
        }
    )


app.add_task(tcp_server())

if __name__ == "__main__":
    app.run(
        host=os.getenv("REACT_APP_HOSTNAME"), port=os.getenv("REACT_APP_SANIC_PORT")
    )
