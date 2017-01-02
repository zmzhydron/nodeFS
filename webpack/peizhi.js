var path = require("path");
var webpack = require("webpack");
module.exports = {
	entry: {
		app: [
			__dirname+"/../client/app.js"
		]
	},
	output: {
    path: path.resolve(__dirname, "hehe"),
    publicPath: "/src/",
		filename: "zmz.js"
	},
	devServer: {
		hot: true,
		inline: true
	},
	plugins	: [
		new webpack.HotModuleReplacementPlugin()
	],
  devtool: 'eval-source-map'
}