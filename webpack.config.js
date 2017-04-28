"use strict";
const WebpackNotifierPlugin = require("webpack-notifier");
const webpack = require("webpack");
const path = require("path");
const absolute = (relPath) => path.join(__dirname, relPath);

let env = process.env.NODE_ENV || "development";

module.exports = {
  entry: {
    "/extension/content-script": "./src/content-script.js",
    "/extension/main-sidebar": "./src/main-sidebar.js",
  },
  output: {
    path: __dirname,
    filename: "[name].js",
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: "json"},
      {
        test: /.js?$/,
        loader: 'babel-loader',
        include: /src/,
        query: {presets: ['react']}
     }
    ]
  },
  // devtool: env === "production" ? null : "eval", // This is for Firefox
  plugins: [
    new WebpackNotifierPlugin(),
  ]
};
