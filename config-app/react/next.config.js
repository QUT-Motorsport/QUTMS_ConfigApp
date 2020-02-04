const withCss = require("@zeit/next-css");
const withLess = require("@zeit/next-less");
// jupyterlab does not transpile their code - so we need to as we are excluding node_modules from transpilation in our tsconfig.json
const withTM = require("next-transpile-modules")([
  "@jupyterlab",
  "@jupyter-widgets"
]);
const lessToJS = require("less-vars-to-js");
const fs = require("fs");
const dotenv = require("dotenv");
const { spawn } = require("child_process");
const path = require("path");
dotenv.config();

const { WEBPACK_TARGET, SANIC_PORT, GLOBAL_HOST, JUPYTER_PORT } = process.env;

const handleErr = (err, fatal = true) => {
  console.error(err);
  if (fatal) {
    throw err;
  }
};

// unusual to load up the python api inside a config file,
// however this solution supports both the next server + electron renderer option
// TODO: test whether this supports the standalone electron app execution context
const spawnApi = () => {
  const api = spawn("python", [path.join(__dirname, "../python/api.py")]);

  api.on("error", handleErr);
  api.stderr.on("data", buffer => handleErr(buffer.toString()));
  api.stdout.on("data", buffer => console.log(buffer.toString()));
};
spawnApi();

// const spawnJupyter = () => {
//   const jupyter = spawn("jupyter", [
//     "notebook",
//     "--no-browser",
//     '--NotebookApp.allow_origin="*"',
//     "--NotebookApp.disable_check_xsrf=True",
//     "--NotebookApp.token=''",
//     "--ip=0.0.0.0",
//     `--port=${process.env.JUPYTER_PORT}`,
//     path.join(__dirname, "../../")
//   ]);

//   jupyter.on("error", handleErr);
//   jupyter.stderr.on("data", buffer => handleErr(buffer.toString(), false));
//   jupyter.stdout.on("data", buffer => console.log(buffer.toString()));
//   process.on("exit", () => {
//     jupyter.kill();
//   });
// };
// spawnJupyter();

module.exports = withLess(
  withCss(
    withTM({
      // required for
      // cssLoaderOptions: {
      //   url: false
      // },
      // cssModules: true,

      lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: lessToJS(
          fs.readFileSync(
            path.resolve(__dirname, "./styles/antd-theme.less"),
            "utf8"
          )
        )
      },

      env: {
        WEBPACK_TARGET,
        SANIC_PORT,
        JUPYTER_PORT,
        GLOBAL_HOST
      },

      webpack: (config, { isServer }) => {
        // get antd theming and module loading working
        if (isServer) {
          const antStyles = /antd\/.*?\/style.*?/;
          const origExternals = [...config.externals];
          config.externals = [
            (context, request, callback) => {
              if (request.match(antStyles)) return callback();
              if (typeof origExternals[0] === "function") {
                origExternals[0](context, request, callback);
              } else {
                callback();
              }
            },
            ...(typeof origExternals[0] === "function" ? [] : origExternals)
          ];

          config.module.rules.unshift({
            test: antStyles,
            use: "null-loader"
          });
        }
        // if we're targeting electron, tell webpack
        if (WEBPACK_TARGET) {
          config.target = WEBPACK_TARGET;
        }

        config.module.rules.push({
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        });

        return config;
      }
    })
  )
);

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};
