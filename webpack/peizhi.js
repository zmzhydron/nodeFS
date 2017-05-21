var path = require("path");
var webpack = require("webpack");
module.exports = {
	entry: {
		app: [
			__dirname+"/../client/app.jsx"
		]
	},
	output: {
    path: path.resolve(__dirname, "hehe"),
    publicPath: "/src/",
		filename: "zmz.js"
	},
	devtool: 'eval-source-map',
	devServer: {
		hot: true,
		inline: true
	},
	plugins	: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
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