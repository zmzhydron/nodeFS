'use strict'

var koa = require("koa")
var router = require("koa-router")()
var koas = require("./koa-components/comp.js")
var koatools = require("./koa-components/koa-tools.js")
var multer = require("koa-multer")
var path = require("path")
var fs = require("fs");
var koabody = require("koa-body")
var upload = multer({ dest: path.join(__dirname, "../shitbird")})
var cluster = require("cluster")
var os = require("os");
var socketIO = require('socket.io');



let workerList = [];
if(cluster.isMaster){
	os.cpus().forEach( (item, index) => {
		workerList.push(cluster.fork());
	})
	cluster.on("listening", (worker, address) => {
		console.log('listening: worker ' + worker.process.pid +', Address: '+address.address+":"+address.port);
	})
	workerList.forEach( (worker,index) => {
		if(index === 0){

		}
		worker.send(`from master with love to you ${worker.id}`)
		worker.on("message", data => {
			console.log(` my worker : ${worker.id} give me a message : ${data}`)
		})
	})
	//初始化infos
	// koas.getFileInofs();
}else{
	var app = new koa();
	var io = new socketIO(8088);
	io.on("connection", socket => {
		console.log('a user connected');
		let val = 0;
		setInterval( () => {
			socket.emit("haha", "haha: @"+val+"_id:"+socket.id)
			val++;
		},1000)
		socket.on("fuckyou", msg => {
			console.log(msg, " suckit!!")
		})
	})
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
			// console.log(err);
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
	app.listen(8081);

}

