"use strict";
const WebpackNotifierPlugin = require("webpack-notifier");
const webpack = require("webpack");
const BannerPlugin = webpack.BannerPlugin;
const path = require("path");
const absolute = (relPath) => path.join(__dirname, relPath);
class AddonPlugin extends BannerPlugin {
  constructor(addonMainPath) {
    super("const platform_require = require; const platform_exports = exports;\n", {
      raw: true,
      include: addonMainPath
    });
  }
}

let env = process.env.NODE_ENV || "development";

module.exports = {
  entry: {
    "/lib/main": "./src/main.js",
    "/data/content-script": "./src/content-script.js",
    "/data/main-sidebar": "./src/main-sidebar.js"
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
    new AddonPlugin("/lib/main")
  ]
};
