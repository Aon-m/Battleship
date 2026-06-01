import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import path from "node:path";

export default merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
    static: [
      {
        directory: path.join(import.meta.dirname, "assets"),
        publicPath: "/assets",
      },
    ],
  },
});
