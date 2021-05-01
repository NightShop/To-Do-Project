const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: './dist',
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
      },
});