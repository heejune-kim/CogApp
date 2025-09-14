const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  target: "electron-main",
  entry: "./main.js", // 진입점 파일 ts도 가능
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: { extensions: [".ts", ".js"] },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader", exclude: /node_modules/ }],
  },
  node: { __dirname: false, __filename: false }, // 패키징 후 경로 보존
};
