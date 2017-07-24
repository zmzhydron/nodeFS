var path = require("path")
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
  entry: path.resolve(__dirname,"./hehe/zmz.js"),
  output: {
    path: path.resolve(__dirname, "./haha"),
    filename: "haha.js"
  },
  // plugins : [
  //   new webpack.ProvidePlugin({
  //     $: "jquery",
  //     jQuery: "jquery"
  //   }),
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings: false
  //     }
  //   })
  // ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
            presets: ['react','es2015','stage-0']
        }
      },
      {
        test: /\.scss?$/,
        exclude: /node_modules/,
        loader: "style-loader!css-loader!sass-loader"
      }
    ]
  },
  resolve: {
    extensions: ['','.coffee','.js']
  }
}