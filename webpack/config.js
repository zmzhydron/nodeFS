var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var pkg = require('../package.json');
var peizhi = require("./peizhi");

peizhi.entry.app.unshift("webpack-dev-server/client?http://192.168.2.91:3000/", "webpack/hot/dev-server");
var server = new WebpackDevServer(webpack(peizhi),{
	hot: true,
	inline: true,
	contentBase: "client/",
	publicPath: "/src/",
	stats: { colors: true, hot: true },
	proxy: {"/api/*": { target:"http://192.168.2.91:8080", secure: false } }
});
var port = pkg.config.devPort;
var host = pkg.config.devHost;
server.listen(port, host, function(err){
	if(err){
		console.log("~error~");
	}
	console.log(__dirname, " __dirname")
})


