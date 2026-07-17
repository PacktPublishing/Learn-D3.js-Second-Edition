import path from 'path';
import {fileURLToPath} from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: {
    index: './js/entries/index.js',
    viz1: './js/entries/viz1.js',
    viz2: './js/entries/viz2.js',
    viz3: './js/entries/viz3.js',
    viz4: './js/entries/viz4.js',
    viz5: './js/entries/viz5.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true,
    assetModuleFilename: 'assets/[name][ext]'
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 5173,
    open: ['index.html'],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(csv|topojson)$/i,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'viz1.html',
      template: './viz1.html',
      chunks: ['viz1'],
    }),
    new HtmlWebpackPlugin({
      filename: 'viz2.html',
      template: './viz2.html',
      chunks: ['viz2'],
    }),
    new HtmlWebpackPlugin({
      filename: 'viz3.html',
      template: './viz3.html',
      chunks: ['viz3'],
    }),
    new HtmlWebpackPlugin({
      filename: 'viz4/index.html',
      template: './viz4/index.html',
      chunks: ['viz4'],
    }),
    new HtmlWebpackPlugin({
      filename: 'viz5.html',
      template: './viz5.html',
      chunks: ['viz5'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'data', to: 'data' },
        { from: 'css', to: 'css' },
        { from: 'viz4/css', to: 'viz4/css' }
      ]
    })
  ],
  resolve: {
    extensions: ['.js']
  }
};
