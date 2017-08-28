var http = require("http")
var net = require("net")
var fs = require("fs");
var opt = {
	host:'127.0.0.1',
	port:'8081',
	method:'GET',//这里是发送的方法
	path:'/api/hello?name=zmz&age=29',     //这里是访问的路径
	headers:{
	 //这里放期望发送出去的请求头
	 'Transfer-Encoding': 'chunked'
	}
}
var req = http.request(opt)
req.write("sending some data to you")
req.end();
req.on("response", (sss, soc) => {
	sss.on("data", cn => {
		console.log(cn.toString(), '回复啦')
	})
	sss.on("end", cn => {
		console.log("回复结束")
	})
	console.log("收到回复")
})

var server = http.createServer( (req,res) => {
	res.write(new Date().toString())
	res.end();
})
server.listen(0)
server.on("connection" , (socket) => {
	console.log("收到net server 传递的请求")
	console.log(socket)
})
var netserver = net.createServer( socket => {
	console.log("传递请求给httpserver")
	server.emit("connection", socket)
}).on("error", err => {
	// console.log(err)
})
netserver.listen(8088)
