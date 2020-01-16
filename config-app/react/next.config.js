const withCSS = require("@zeit/next-css");
const dotenv = require("dotenv");
const { spawn } = require("child_process");
const path = require("path");
dotenv.config();

const { WEBPACK_TARGET, FLASK_PORT, GLOBAL_HOST } = process.env;

// unusual to load up the python api inside a config file,
// however this solution supports both the next server + electron renderer option
// TODO: test whether this supports the standalone electron app execution context
const api = spawn("python", [path.join(__dirname, "../python/api.py")]);

const handleErr = err => {
  throw err;
};

api.on("error", handleErr);
api.stderr.on("data", buffer => handleErr(buffer.toString()));

api.stdout.on("data", buffer => console.log(buffer.toString()));

module.exports = withCSS({
  env: {
    WEBPACK_TARGET,
    FLASK_PORT,
    GLOBAL_HOST
  },

  webpack: config =>
    WEBPACK_TARGET
      ? {
          ...config,
          target: WEBPACK_TARGET
        }
      : config
});
