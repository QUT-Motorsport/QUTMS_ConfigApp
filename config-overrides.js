const ClosurePlugin = require("closure-webpack-plugin");

module.exports = function override(config, _env) {
  config.optimization.minimizer.push(new ClosurePlugin());
  return config;
};
