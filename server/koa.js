'use strict'

var koa = require("koa")
var router = require("koa-router")()
var app = new koa();
var koas = require("./koa-components/comp.js")
var koatools = require("./koa-components/koa-tools.js")
var multer = require("koa-multer")
var path = require("path")
var fs = require("fs");
var koabody = require("koa-body")
var upload = multer({ dest: path.join(__dirname, "../shitbird")})

// var mongoApi = require("./db/mongoose.js")

app.use(async (o, next) =>{
	try{
		await next();
	}catch(err){
		o.response.status = 500;
		console.log(err);
		o.body = {
			errorCode: 0,
			message: err+" >> "+o.outfit+ " >> "+o.url
		};
	}
})
app.use(koabody())
app.use(async (o,next) => {
	// throw new Error("去屎吧")
	console.log(o.query,o.querystring, o.body,"  queryyyyyyyyyyyyyyy ")
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
// router.get("/api/getCollections",mongoApi.getCollections())

router.get("/api/download",koas.download())
router.post("/api/getPhoto",koas.getPhoto())
app.use(async(o,next) => {
	// o.body = `i am zmz, and i say:`;
	await next();
	// o.body += " :D"
})
router.post("/api/upload", upload.single("fuckyoutoo"), koas.upload())
app.use( async (o, next) =>{
	if(o.isrr){
		o.outfit = "nothing"	
		console.log(o)
		console.log(this)
	}else{
		o.outfit = 'black lace'
	}
	// console.log(aaa)

	o.body += `kendra lust wear ${o.outfit} and suck it down >>> ${o.pos} style`;
})
app.listen(8081)
