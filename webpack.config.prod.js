const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: './src/app.jsx',
  devtool: 'inline-sourcemap',
  devtool: null,
  output: {
    path: "./public",
    publicPath: "./",
    filename: 'app.[hash].min.js'
  },
  module: {
    loaders: [
      {
        test : /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader : 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties',
            'react-html-attrs'
          ]
        }
      },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=images/[name]_[hash:4].[ext]"
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      }
    ]
  },
  resolve: {
    extensions: ['.js', ''],
    alias: {
      config: path.resolve(__dirname, './src/config.prod'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({ config: 'config' }),
    new WebpackCleanupPlugin(),
    new HtmlWebpackPlugin({
      title: 'EnjoyCls',
      inject: false,
      template: 'src/staticFiles/index.ejs',
      externalSources: {
        css: [
          '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
        ],
        js: [
          '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js',
          '//apis.google.com/js/api.js',
          '//platform.linkedin.com/in.js?async=true'
        ]
      },
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new FaviconsWebpackPlugin(
      path.resolve(__dirname, './src/staticFiles/favicon.png')
    ),
    new ExtractTextPlugin("app.[hash].min.css"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ]
};
