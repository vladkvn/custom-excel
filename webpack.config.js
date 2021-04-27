const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const distFolder = path.resolve(__dirname, 'dist')

module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: {
        main: './index.js'
    },
    output: {
        path: distFolder,
        filename: '[name].bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({template: './index.html'}),
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, "src/favicon.ico"), to: distFolder},
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].bundle.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}