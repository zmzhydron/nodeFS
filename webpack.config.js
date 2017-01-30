var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	entry: {
		app: [
			__dirname+"/client/app.jsx"
		]
	},
	output: {
    path: path.resolve(__dirname,"./client/src/"),
    publicPath: "/src/",
		filename: "zmz.js"
	},
  devtool: 'eval-source-map',
  devServer: {
  	hot: true,
  	inline: true,
  	contentBase: "client/"
  },
  
  module: {
  	loader: [
  		{
  			test: /\.js?$/,
  			exclude: /node_modules/,
  			loader: "babel-loader",
  			query: {
  				presets: ['es2015']
  			}
  		},
  		{
  			test: /\.scss?$/,
  			exclude: /node_modules/,
  			loader: "style-loader!css-loader!sass-loader"
  		}
  	]
  }
}
