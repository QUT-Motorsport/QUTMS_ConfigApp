from sanic import Sanic
from sanic.response import json
from sanic_cors import CORS
import os
from dotenv import load_dotenv
from pathlib import Path
import sys

load_dotenv()

DIR = Path(__file__).parent
sys.path.append(str((DIR / "../..").resolve()))

from qev3.ldparser import read_ldfile

head, channels = read_ldfile(DIR / "Sample.ld")


app = Sanic(__name__)
# Allow react app being served off another port (react app) to access sanic
CORS(app, automatic_options=True)


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
    app.run(port=os.getenv("SANIC_PORT"))
