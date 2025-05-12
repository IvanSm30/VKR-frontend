const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    host: "0.0.0.0",
    port: 9000,
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:8000",
      },
    ], 
  },
});
