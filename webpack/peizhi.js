var path = require("path");
var webpack = require("webpack");
module.exports = {
	entry: {
		app: [
			path.join(__dirname,"/../client/app.jsx")
		]
	},
	// entry: path.join(__dirname,"/../client/app.jsx"),
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
			jQuery: "jquery",
			tools: __dirname+"./../client/src/tools/tools.js"
		})
	],
	alias: {
		"tools": __dirname+"./client/src/tools/tools.js"
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
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