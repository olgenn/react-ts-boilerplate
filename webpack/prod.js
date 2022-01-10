// production config
const { merge } = require("webpack-merge");
const {join} = require('path');
const {buildDir, publicPath, srcDir} = require('./env');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const base = require("./base");

module.exports = merge(base, {
    mode: "production",
    entry: join(srcDir, 'index.tsx'),
    output: {
        path: buildDir,
        filename: "[name]-[contenthash].js",
        publicPath: publicPath,
        clean: true,
    },
    devtool: "source-map",
    plugins: [
        new MiniCssExtractPlugin(),
    ],
    optimization: {},
});
