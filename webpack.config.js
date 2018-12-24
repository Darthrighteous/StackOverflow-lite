const precss = require('precss');
const autoprefixer = require('autoprefixer');
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  precss,
                  autoprefixer
                ];
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    disableHostCheck: true,
    contentBase: path.join(__dirname, 'client', 'index.html'),
    port: 8080,
    historyApiFallback: true,
    hot: true
  },
});
