'use strict'

var koa = require("koa")
var router = require("koa-router")()
var app = new koa();
var koas = require("./koa-components/1.js")
var multer = require("koa-multer");
var path = require("path")
var fs = require("fs");
var upload = multer({ dest: path.join(__dirname, "../shitbird")})

app.use(router.routes()).use(router.allowedMethods())

router.use("/", async (o, next) =>{
	o.body += `${o.pos}`; 
	console.log(6)
	await next();
	console.log(9)
})

router.get("/api/rr",async (o, next) =>{
	console.log(7)
	o.pos = 'ride'
	o.body += `${o.pos}`;
	await next();
	console.log(8)
})

app.use(async(o,next) => {
	o.body = `i am zmz, and i say:`;
	o.pos = 'doggy'
	console.log(1)
	await next();
	console.log(5)
	o.body += " :D"
})

router.post("/api/upload", upload.single("fuckyoutoo"), koas.upload())

app.use(async (o, next) =>{
	console.log(2)
	await next();
	console.log(4)		
})

app.use( async (o, next) =>{
	if(this.isrr){
		this.outfit = "nothing"	
	}else{
		this.outfit = 'black lace'
	}
	console.log(3)
	o.body += `kendra lust wear ${this.outfit} and suck it dow`;
})


app.listen(8081)
