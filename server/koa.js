'use strict'

var koa = require("koa")
var router = require("koa-router")()
var app = new koa();
var koas = require("./koa-components/1.js")
var koatools = require("./koa-components/koa-tools.js")
var multer = require("koa-multer");
var path = require("path")
var fs = require("fs");
var upload = multer({ dest: path.join(__dirname, "../shitbird")})

var mongoApi = require("./db/mongoose.js")

app.use(async (o, next) =>{
	this.pos = 'doggy';
	try{
		await next();
	}catch(err){
		o.status = 500;
		o.body = {
			errorCode: 0,
			message: err.message+" >> "+this.outfit+ " >> "+o.url
		};
	}
})
app.use(async (o,next) => {
	// throw new Error("去屎吧")
	await next();
})
app.use(koatools.test())
app.use(router.routes()).use(router.allowedMethods())



router.get("/api/rr",async (o, next) =>{
	o.pos = 'ride'
	await next();
	// o.body += `>>>${this.pos}`; 
})

router.get("/api/getCollections",mongoApi.getCollections())


app.use(async(o,next) => {
	o.body = `i am zmz, and i say:`;
	await next();
	o.body += " :D"
})

router.post("/api/upload", upload.single("fuckyoutoo"), koas.upload())



app.use( async (o, next) =>{
	if(this.isrr){
		this.outfit = "nothing"	
	}else{
		this.outfit = 'black lace'
	}
	// console.log(aaa)
	o.body += `kendra lust wear ${this.outfit} and suck it down >>> ${o.pos} style`;
})


app.listen(8081)
