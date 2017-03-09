var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: './app/index.js',
        vendor: ['angular']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: "build/",
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|woff|woff2|eot|ttf)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "file-loader",
                    use: "url-loader"
                })
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.bundle.js"
        })
    ]
};