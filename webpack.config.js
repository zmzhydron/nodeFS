var path = require("path")
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
  entry: path.join(__dirname,"./client/app.jsx"),
  output: {
    path: path.resolve(__dirname, "buildSrc"),
    publicPath: "/src/",
    filename: "zmz.js"
  },
  // devtool: 'eval-source-map',
  devServer: {
    hot: true,
    inline: true
  },
  plugins : [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      tools: path.join(__dirname,"./client/src/tools/tools.js")
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
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