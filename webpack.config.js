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

const SRC_PATH = absolute("src/main.js");
const CONTENT_SCRIPT_SRC_PATH = absolute("src/content-script");
const OUTPUT_FILE = "/lib/main";
const CONTENT_SCRIPT_FILE = "/data/content-script";


let env = process.env.NODE_ENV || "development";

const entry = {};
entry[OUTPUT_FILE] = SRC_PATH;
entry[CONTENT_SCRIPT_FILE] = CONTENT_SCRIPT_SRC_PATH;

module.exports = {
  entry,
  output: {
    path: __dirname,
    filename: "[name].js",
  },
  module: {
    loaders: [{test: /\.json$/, loader: "json"}]
  },
  // devtool: env === "production" ? null : "eval", // This is for Firefox
  plugins: [
    new WebpackNotifierPlugin(),
    new AddonPlugin(OUTPUT_FILE)
  ]
};
