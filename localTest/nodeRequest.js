var http = require("http")
var net = require("net")
var fs = require("fs");
var opt = {
	host:'127.0.0.1',
	port:'8081',
	method:'get',//这里是发送的方法
	path:'/api/hello?name=zmz&age=29',     //这里是访问的路径
	headers:{
	 //这里放期望发送出去的请求头
	}
}
var req = http.request(opt)
req.on("response", (req, soc) => {
	// console.log(req);
	// req.req.socket.on("data", cn => {
	// 	console.log(cn.toString())
	// })
	req.on("data", cn => {
		console.log(cn.toString())
	})
	req.on("end", cn => {
		console.log("lalala")
	})
	// let resStr = JSON.stringify(res, null, 2);
	// fs.writeFile("./res.txt", resStr, (err) => {
	// 	if(!err){
	// 		console.log(`success!!`)
	// 	}
	// })
	console.log("!!!!!!!!!!!!!!!!")
})
req.on("data", chunk => {
	console.log(`req.on("data", chunk => { ${chunk.toString()}`)
})
req.on("connection" , (res, soc, head) => {
	console.log("@@@@@@@@@@@@@@");
	soc.on("data", (chunk) => {
		console.log(chunk)
	})
})
req.end();

// http.createServer( (req, res) => {
// 	console.log(req)
// }).listen(8082)

var netserver = net.createServer( socket => {
	socket.end("fuckyou")
}).on("error", err => {
	console.log(err)
})
netserver.listen( () => {
	console.log(`netserver.address:`,netserver.address());
})