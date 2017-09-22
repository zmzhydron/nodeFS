var path = require("path")
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports = {
  entry: {
    zmz1: path.resolve(__dirname,"./client/app.jsx"),
    pussy: path.resolve(__dirname,"./client/webpack1.js"),
    fuck: path.resolve(__dirname,"./client/webpack2.js"),
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    // publicPath: "http://www.zzhangmingzhimba.com:8081/"
    // publicPath: "http://localhost:8081/"
    publicPath: "./"
  },
  devtool: 'eval-source-map',
  plugins : [
    //拷贝打包目录下的文件、文件夹到指定的输出
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "./client/src/rawSrc"), 
        to: path.join(__dirname, "./build/src/rawSrc")
      },
      {
        from: path.join(__dirname, "./node_modules/_jquery@3.2.1@jquery/dist/jquery.min.js"),
        to: path.join(__dirname, "./build/src/rawSrc/jquery.min.js")
      }
    ]),
    new webpack.ProvidePlugin({
      // $: "jquery",
      // jQuery: "jquery",
      tools: "tools"
    }),

    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    })
    // new webpack.optimize.UglifyJsPlugin() //部署才用，作用是最小化文件，开发情况下会增加打包时间
  ],
  externals: {
    'react': 'window.React',
    'react-dom' : 'window.ReactDOM',
    'jquery' : 'jQuery',
    'jquery' : '$',
    // "tools": "window.tools"
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
      },
      {
        test: /\.(jpg|png)$/,
        exclude: /node_modules/,
        loader: "url-loader?limit=1&nameimgs/[hash:5].[name].[ext]"
      }
      // {
      //   test: /\.png|\.jpg?$/,
      //   exclude: /node_modules/,
      //   loader: "file-loader?name=imgs/[name]-[hash].[ext]",
      //   // query: {
      //   //   name: "./imgs/[name].[ext]"
      //   // }
      // }
    ]
  },
  resolve: {
    extensions: [".jsx",'.js','.coffee'],
    alias: {
      tools$: path.resolve(__dirname, "./client/src/tools/tools.js"),
      // imgs: path.resolve(__dirname, "./build/imgs"),
    }
  }
}