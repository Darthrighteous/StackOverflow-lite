const precss = require('precss');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [{
      test: /\.(s*)css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
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
    }]
  },
});
