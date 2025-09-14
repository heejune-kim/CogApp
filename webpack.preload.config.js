const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  target: "electron-preload",
  entry: "./src/preload.ts",
  output: {
    filename: "preload.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: { extensions: [".ts", ".js"] },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader", exclude: /node_modules/ }],
  },
};
