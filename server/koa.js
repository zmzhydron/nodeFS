'use strict'
var koa = require("koa")
var http = require("http");
var router = require("koa-router")()
var koas = require("./koa-components/comp.js")
var koatools = require("./koa-components/koa-tools.js")
var multer = require("koa-multer")
var path = require("path")
var net = require('net')
var fs = require("fs");
var koabody = require("koa-body")
var upload = multer({ dest: path.join(__dirname, "../shitbird")})
var cluster = require("cluster")
var os = require("os");
var socketIO = require('socket.io');

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
		console.log(workerID, " @@@@@@@@@@@@@  ")
		cluster.workers[workerID].send("sticky-session", conn);
	}).listen(8081)
	// console.log(workerList[0])
	// koas.getFileInofs();
}else{
	var app = new koa();
	// var mongoApi = require("./db/mongoose.js")
	app.use(async (o, next) =>{
		try{
			process.on("message", data => {
				console.log(` message from abouv : ${data}`)
			})
			process.send(`${cluster.worker.id} is Process your requrst`)
			await next();
		}catch(err){
			o.response.status = 500;
			o.body = {
				errorCode: 0,
				message: err+" >> "+o.outfit+ " >> "+o.url
			};
		}
	})
	app.use(koabody())
	app.use(async (o,next) => {
		// throw new Error("去屎吧")
		// console.log(o.query,o.querystring, o.body,"  queryyyyyyyyyyyyyyy ")
		// o.throw(500, 'name required'); //也可以绕过第一个错误处理的方法；
		await next();
	})
	app.use(koatools.test())
	app.use(router.routes()).use(router.allowedMethods())
	router.get("/api/rr",async (o, next) =>{
		o.pos = 'ride';
		o.isrr = true;
		await next();
	})
	router.get("/api/",async (o, next) =>{
		o.pos = 'ride';
		o.isrr = true;
		await next();
	})
	// router.get("/api/getCollections",mongoApi.getCollections())

	router.get("/api/download",koas.download())
	router.post("/api/getPhoto",koas.getPhoto())
	// router.post("/api/initPhotos",koas.initPhotos())
	app.use(async(o,next) => {
		// o.body = `i am zmz, and i say:`;
		await next();
		// o.body += " :D"
	})
	router.post("/api/upload", upload.single("fuckyoutoo"), koas.upload())
	app.use( async (o, next) =>{
		if(o.isrr){
			o.outfit = "nothing"	
			// console.log(o)
			// console.log(this)
		}else{
			o.outfit = 'black lace'
		}
		// console.log(aaa)

		o.body += `kendra lust wear ${o.outfit} and suck it down >>> ${o.pos} style`;
	})
	var server = app.listen(0);
	var io = socketIO(server);
	process.on("message", (msg, handler) => {
		if(msg !== "sticky-session"){
			console.log("koa.js, cluster socket.io need font-facing server response first!!!")
			return;
		}
		server.emit("connection", handler);
		handler.resume();
	})
	// io.on("connection", socket => {
	// 	let val = 0;
	// 	setInterval( () => {
	// 		socket.emit("haha", "haha: @"+val+"_id:"+socket.id)
	// 		val++;
	// 	},1000)
	// 	socket.on("fuckyou", msg => {
	// 		// console.log(msg, " suckit!!")
	// 	})
	// })
	// htp.on("connection", data => {
	// 	// console.log(data)
	// 	console.log(' a user just connect ')
	// })
	// console.log()
	// console.log("*************************",htp)
	// console.log()
	// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@",app)
	// let socketList = {};
}

