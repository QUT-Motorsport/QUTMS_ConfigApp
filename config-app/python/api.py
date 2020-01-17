from sanic import Sanic
from sanic.response import json
from sanic_cors import CORS
import os
from calc import calc
from dotenv import load_dotenv
load_dotenv()


app = Sanic(__name__)
# Allow react app being served off another port (react app) to access sanic
CORS(app, automatic_options=True)


@app.post("/calc")
async def post_calc(req):
    return json({'calc': calc(req.json['math']) + 1})


if __name__ == "__main__":
    app.run(port=os.getenv("FLASK_PORT"))
