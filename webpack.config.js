var path = require("path")
var webpack = require("webpack");
module.exports = {
  entry: {
    index: path.resolve(__dirname,"./client/app.jsx"),
  },
  output: {
    path: path.resolve(__dirname, "./client"),
    filename: "zmz1.js"
  },
  plugins : [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),
    new webpack.optimize.UglifyJsPlugin() //部署才用，作用是最小化文件，开发情况下会增加打包时间
  ],
  externals: {
    'react': 'window.React'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  
          query: {
              presets: ['react','es2015','stage-0'],
              "plugins": [[
                "transform-runtime",
                {
                  "helpers": false,
                  "polyfill": false,
                  "regenerator": true,
                  "moduleName": "babel-runtime"
                }
              ]]
          }
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
    extensions: ['.coffee','.js','.jsx']
  }
}