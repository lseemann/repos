var webpack = require('webpack');

module.exports = {
  entry: [
    './js/app.js'
  ],
  output: {
    path: __dirname + '/js/',
    publicPath: '/js/',
    filename: "bundle.js"
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      'd3': 'd3'
    }),

  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel'
    }]
  },
  watch: true
};