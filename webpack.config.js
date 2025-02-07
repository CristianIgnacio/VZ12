var webpack = require('webpack');
var plugins = require('./webpack.plugins.js');
var config = {
  context: __dirname + '/app',
  entry: {
    app: './app.js'
  },
  output: {
    path: __dirname + '/app',
    filename: 'bundle.[name].[chunkhash].js',
    publicPath: '/'
  },
  devServer: {
    disableHostCheck: true
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'ng-annotate!babel?presets[]=es2015', exclude: [/node_modules/, /bower_components/]},
      { test: /[\/]angular\.js$/, loader: 'exports?angular'},
      { test: /\.html$/, loader: 'raw-loader', exclude: [/node_modules/]},
      { test: /\.css$/, loader: 'style-loader!css-loader', exclude: [/node_modules/]},
      { test: /\.scss$/, loaders: ['style', 'css', 'sass'], exclude: [/node_modules/, /bower_components/]},
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
    ]
  },
  plugins: plugins
};

if (process.env.NODE_ENV === 'production') {
  config.output.path = __dirname + '/dist';

  config.module = {
      loaders: [
        { test: /\.js$/, loader: 'ng-annotate!babel?presets[]=es2015', exclude: [/node_modules/, /bower_components/]},
        { test: /[\/]angular\.js$/, loader: 'exports?angular'},
        { test: /\.html$/, loader: 'raw-loader', exclude: [/node_modules/]},
        { test: /\.css$/, loader: 'style-loader!css-loader', exclude: [/node_modules/]},
        { test: /\.scss$/, loaders: ['style', 'css', 'sass'], exclude: [/node_modules/, /bower_components/]},
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
        { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
      ]
  }
}

module.exports = config;
