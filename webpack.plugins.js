var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BowerWebpackPlugin = require("bower-webpack-plugin");

var plugins = [
    new BowerWebpackPlugin({
        modulesDirectories: ["bower_components"],
        manifestFiles: "bower.json",
        includes: /.*/,
        excludes: [],
        searchResolveModulesDirectories: true
    }),

    new webpack.optimize.UglifyJsPlugin({
        compress: { 
            warnings: true 
        },
        mangle: false,
        beautify: false,
        comments: false
    }),

    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    }),

    new webpack.ProvidePlugin({
        Selectize: "selectize",
        "window.Selectize": "selectize"
    }),

    new HtmlWebpackPlugin({
        template: './index.html'
    })

];

module.exports = plugins;

