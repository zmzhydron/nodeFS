var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var pkg = require('../package.json');
var peizhi = require("./peizhi");

var url = "webpack-dev-server/client?http://localhost:3002" //gongsi
// var url = "webpack-dev-server/client?http://localhost:3000" //jia
// var temp = "webpack-dev-server/client?http://192.168.2.91:3000/"

var url2 = 'http://localhost:8081' //gongsi
// var url2 = 'http://localhost:8080' //jia
// url2 = http://192.168.2.91:8080

peizhi.entry.app.unshift(url, "webpack/hot/dev-server");
var server = new WebpackDevServer(webpack(peizhi),{
	hot: true,
	inline: true,
	contentBase: "client/",
	publicPath: "/src/",
	stats: { colors: true, hot: true },
	proxy: {"/api/*": { target:url2, secure: false } }
});
var port = pkg.config.devPort;
var host = pkg.config.devHost;
server.listen(port, host, function(err){
	if(err){
		console.log("~error~");
	}
	console.log(__dirname, " __dirname")
})


