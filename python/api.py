from sanic import Sanic
from sanic.response import json
from sanic import response as res
from sanic_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
from motec.ldparser import read_ldfile
import glob

load_dotenv()

head, channels = read_ldfile(Path(__file__).parent / "Sample")

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


if __name__ == "__main__":
    app.run(port=os.getenv("REACT_APP_SANIC_PORT"))
