const ClosurePlugin = require("closure-webpack-plugin");
const TypedocWebpackPlugin = require("typedoc-webpack-plugin");

module.exports = function override(config, _env) {
  // add closure compiler to apply generic code optimizations
  config.optimization.minimizer.push(new ClosurePlugin());

  // add typedoc plugin to automatically update docs
  // config.plugins.push(
  //   new TypedocWebpackPlugin({
  //     theme: "typedoc-neo-theme",
  //     // unsure why but this causes compiler errors.
  //     // It has already successfully compiled by this point (last plugin on the list) so this is safe.
  //     ignoreCompilerErrors: true,
  //   })
  // );

  return config;
};
