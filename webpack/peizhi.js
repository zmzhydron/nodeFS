var path = require("path");
module.exports = {
	entry: {
		app: [
			__dirname+"/../client/app.js"
		]
	},
	output: {
    path: path.resolve(__dirname, "hehe"),
    publicPath: "/assets/",
		filename: "zmz.js"
	},
  devtool: 'eval-source-map'
}