var os = require("os");
var cp = require("child_process");
var path = require("path")
var net = require("net")
var fs = require("fs")
var server1 = net.createServer();
server1.listen("8888")
server1.on("connection", socket => {
	socket.end("hehe")
})
var slave1 = cp.fork(path.resolve(__dirname,"./slave.js"))

slave1.send("i am master")
slave1.send("net", server1)
let msgCount = 0;
slave1.on("message", data=>{
	fs.appendFile("C:/haha.txt", data, err => {
		if(err){
		}
	})
	msgCount++;
	// console.log(`total counting @ ${msgCount}`)
})
setTimeout( () => {
	console.log(` slave1.pid is ${slave1.pid}`)
	slave1.kill();	
}, 1000)

