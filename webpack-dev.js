var path = require("path")
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports = {
  entry: {
    zmz1: path.resolve(__dirname,"./client/app.jsx"),
    // pussy: path.resolve(__dirname,"./client/webpack1.js"),
    // fuck: path.resolve(__dirname,"./client/webpack2.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dev"),
    filename: "[name].js",
    // publicPath: "http://www.zzhangmingzhimba.com:8081/"
    // publicPath: "http://localhost:8081/"
    publicPath: "/fuckoff/"
  },
  // devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, "./client"),
    port: 9988,
    hot: true,
    // publicPath: "/asdf/",
    host: "127.0.0.1",
    inline: true,
    proxy: {
      "/api": "http://localhost:8081"
    }
  },
  plugins : [
    new webpack.HotModuleReplacementPlugin(),
    //拷贝打包目录下的文件、文件夹到指定的输出, to的路径如果在dev-server的情况下，路径组合是下面这样的
    /*
      // {output}/to/file.txt
      { from: 'from/file.txt', to: 'to/file.txt' },

      路径组合是根据output配置来决定的
      outout.path 和 to的路径配置相同并且有output.publicPath就会被替换成publicPath中的路径。
      并输出到内存中的虚拟文件夹，文件夹的路径就是output.publicPath的路径

      页面应用的路径就是 src="/fuckoff/jquery.min.js"
      详见：https://github.com/kevlened/copy-webpack-plugin
    */
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "./client/src/rawSrc"),
        // to:  "./"
        // to: path.join(__dirname, "./dev/src"),
      },
      // {
      //   from: path.join(__dirname, "./build/src/vendors.js"),
      //   to: "./src/vendors.js"
      // },
      {
        from: path.join(__dirname, "./build/vendors/vendors.js")
        // to: path.join(__dirname, "./dev/src")
      },
      {
        from: path.join(__dirname, "./node_modules/_jquery@3.2.1@jquery/dist/jquery.min.js")
        // to: path.join(__dirname, "./dev/fuckoff/jquery.min.js")
      }
    ]),
    new webpack.ProvidePlugin({
      // $: "jquery",
      // jQuery: "jquery",
      tools: "tools"
    })
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./manifest.json'),
    // })
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
        loader: "url-loader",
        options: {
          limit: 1,
          name: "./src/[name]-[hash:4].[ext]"
        }
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