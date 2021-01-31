/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  entry: ['regenerator-runtime', './src/index.ts'],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].bundle.js',
    sourceMapFilename: '[name].[contenthash].js.map',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CleanWebpackPlugin(),
  ],
  stats: {
    colors: true,
    reasons: true,
    chunks: true,
  },
  devServer: {
    host: '0.0.0.0',
    port: 8011,
    progress: true,
    hot: true,
    historyApiFallback: true,
    compress: true,

    // added because of bug in webpack, remove this once the bug is resolved
    disableHostCheck: true,
  },
};
