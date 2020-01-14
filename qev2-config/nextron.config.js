module.exports = {
  webpack: (defaultConfig, _env) =>
    Object.assign(defaultConfig, {
      entry: {
        background: "./electron/background-with-python-api.ts"
      }
    }),
  // specify an alternate main src directory, defaults to 'main'
  mainSrcDir: "electron",
  // specify an alternate renderer src directory, defaults to 'renderer'
  rendererSrcDir: "react"
};
