/**
 * Created by filowlee on 15/12/19.
 */
'use strict';

var webpack = require('webpack'),
  path = require('path'),
  srcPath = path.join(__dirname, 'src');

module.exports = {
  target: 'web',
  // cache: true,
  context: srcPath,
  entry:  './index.js',
  resolve: {
    root: srcPath,
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'app']
  },
  output: {
    path: path.join(__dirname, 'built'),
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      { test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {test: /\.styl$/,loader: 'style!css!stylus'},
      {test: /\.css$/,loader: 'style!css'},
      {test: /\.vue$/, loader: 'vue'},
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2|png)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: []
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
} else {
  module.exports.debug =  true;
  module.exports.devtool = '#source-map'
}
