module.exports = {
  webpack: (defaultConfig, _env) => ({
    ...defaultConfig,
    entry: {
      background: "./electron/background.ts"
    }
  }),
  // specify an alternate main src directory, defaults to 'main'
  mainSrcDir: "electron",
  // specify an alternate renderer src directory, defaults to 'renderer'
  rendererSrcDir: "react"
};
