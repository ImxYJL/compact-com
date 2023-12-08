//import path from 'path';
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './scripts/main.js', // 해당 경로를 본인의 진입점 파일 경로로 변경해주세요.
  output: {
    publicPath: '/',
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
