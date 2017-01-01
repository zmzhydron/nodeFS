var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var pkg = require('../package.json');
var peizhi = require("./peizhi");


peizhi.entry.app.unshift("webpack-dev-server/client?http://localhost:3000/");
var server = new WebpackDevServer(webpack(peizhi),{
	colors: true,
	hot: true,
	inline: true,
	contentBase: "client/",
	publicPath: "/assets/",
	stats: { colors: true }
});
var port = pkg.config.devPort;
var host = pkg.config.devHost;
server.listen(port, host, function(err){
	if(err){
		console.log("~error~");
	}
	console.log('server just start');
})


