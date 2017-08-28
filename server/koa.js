'use strict'
var koa = require("koa")
var http = require("http");
var path = require("path")
var net = require('net')
var fs = require("fs");
var cluster = require("cluster")
var os = require("os");
var socketIO = require('socket.io');
var koaSingle = require("./koa-thread.js");
// var mongoApi = require("./db/mongoose.js")

function convertip(ip, len){
	let ipstr = "";
	ip.split("").forEach( item => {
		let num = parseInt(item);
		if(!isNaN(num)){
			ipstr += num;
		}
	})
	return ipstr % len;
}

if(cluster.isMaster){
	os.cpus().forEach( (item, index) => {
		cluster.fork()
	})
	cluster.on("listening", (worker, address) => {
		console.log('listening: worker ' + worker.process.pid +', port: '+address.port);
	})
	cluster.on("exit", (worker, code, signal) => {
		setTimeout( () => {
			console.log(`worker : ${worker.process.id}, index: ${index} 重启`)
			worker.fork();
		},1000);
	})
	// for(let id in cluster.workers){
		// let _worker = cluster.workers[id];
		// _worker.send(`from master with love to you ${id}`)
		// _worker.on("message", data => {
		// 	console.log(` my worker : ${_worker.process.id} give me a message : ${data}`)
		// })
	// }
	net.createServer({ pauseOnConnect: true }, conn => {
		let workerID = convertip(conn.remoteAddress, os.cpus().length);
		// console.log(workerID, " koa.js: @@@@@@@@@@@@@  ")
		cluster.workers[workerID].send("sticky-session", conn);
	}).listen(8081)
}else{
	// koaSingle();
	/***********************************/
	var server = http.createServer( (req, res) => {

		res.write(`nihao :  ${ req.connection.remoteAddress}`)
		res.end();
	})
	server.listen(0);
	server.on("connection", req => {
		req.on("data", chunk => {
			console.log('收到数据***********: ', chunk.toString(), "****************")
		})
		console.log(`收到请求`)
	})
	// server.on("connect", (req, sock, head) => {
	// 	console.log(`server.on("connect", (req, sock, head) => {`)
	// 	// sock.write("connect received")
	// 	// sock.end();
	// })
	process.on('message', (msg, handler) => {
		console.log(msg, " $$$$$$$$$$$$$$$  ");
		if(msg === 'sticky-session'){
			server.emit("connection", handler);
		}
	})

	/***********************************/
}

