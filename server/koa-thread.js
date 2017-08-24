var koa = require("koa")
var router = require("koa-router")()
var koas = require("./koa-components/comp.js")
var koatools = require("./koa-components/koa-tools.js")
var multer = require("koa-multer")
var path = require("path")
var fs = require("fs");
var koabody = require("koa-body")
var upload = multer({ dest: path.join(__dirname, "../shitbird")})
var socketIO = require('socket.io');

function gogo(){
	var app = new koa();
	var soc;
	app.use(async (o, next) =>{
		console.log("logingg")
		// o.body = "hehe"
		try{
			// o.io = soc; //bind socket to koa request instances
			// soc.emit("m3", " ask you shale receive, bimmer m3 , yeah..")	
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
		// o.throw(500, 'name required'); //也可以绕过第一个错误处理的方法；
		console.log(o.query,o.querystring, o.request.body,"  queryyyyyyyyyyyyyyy ")
		o.skill = o.request.body.skill || "sleep";
		await next();
	})
	app.use(koatools.test())
	app.use(router.routes()).use(router.allowedMethods())
	router.get("/api/rr", async (o, next) =>{
		o.pos = 'ride';
		o.isrr = true;
		await next();
	})
	router.get("/api/",koabody, async (o, next) =>{
		o.pos = 'ride';
		o.isrr = true;
		console.log(o.query,o.querystring, o.request.body, o.body,"  ~~~~~~~~~~~~~~~~~~ ")
		await next();
	})
	// router.get("/api/getCollections",mongoApi.getCollections())

	router.get("/api/download",koas.download())
	router.post("/api/getPhoto",koas.getPhoto())
	router.post("/api/initPhotos",koas.initPhotos())
	router.post("/api/sendEmail",koas.sendEmail())
	router.post("/api/upload", upload.single("hehe"), koas.upload())
	router.post("/api/trax", upload.single("hehe"), koas.trax())
	app.use( async (o, next) =>{
		if(o.isrr){
			o.outfit = "nothing"	
		}else{
			o.outfit = 'black lace'
		}
		o.body = ` ^^kendra lust wear ${o.outfit} and suck it down >>> ${o.pos} style`;
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
	io.on("connection", socket => {
		socket.on("setSoc", msg => {
			soc = socket;
		})
	})
}
module.exports = gogo;