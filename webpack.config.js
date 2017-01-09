var path = require("path");
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
  		}
  	]
  }
}
