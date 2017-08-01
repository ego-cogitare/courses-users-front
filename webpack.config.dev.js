const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/app.jsx',
  devtool: null,
  output: {
    path: "./public/",
    filename: 'app.min.js'
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    contentBase: 'src/staticFiles'
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
        loader: 'style!css'
      },
      {
        test: /\.(woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=assets/images/[name]_[hash:4].[ext]"
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=assets/fonts/[name].[ext]"
      }
    ]
  },
  resolve: {
    extensions: ['.js', ''],
    alias: {
      config: path.resolve(__dirname, './src/config.dev'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({ config: 'config' })
  ]
};
