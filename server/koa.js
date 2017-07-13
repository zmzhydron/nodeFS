'use strict'

var koa = require("koa")
var router = require("koa-router")()
var app = new koa();
var koas = require("./koa-components/1.js")
var multer = require("koa-multer");
var path = require("path")
var fs = require("fs");
var upload = multer({ dest: path.join(__dirname, "../shitbird")})

var mongoApi = require("./db/mongoose.js")

app.use(async (o, next) =>{
	console.log(4)
	this.pos = 'doggy';
	await next();
	console.log(6)		
})

app.use(router.routes()).use(router.allowedMethods())

router.get("/api/rr",async (o, next) =>{
	console.log(2)
	this.pos = 'ride'
	console.log(this.pos, " ******** ")
	await next();
	// o.body += `>>>${this.pos}`; 
	console.log(8)
})
router.get("/api/getCollections",mongoApi.getCollections())
app.use(async(o,next) => {
	o.body = `i am zmz, and i say:`;
	console.log(3, o.url)
	await next();
	console.log(7)
	o.body += " :D"
})

router.post("/api/upload", upload.single("fuckyoutoo"), koas.upload())

app.use( async (o, next) =>{
	if(this.isrr){
		this.outfit = "nothing"	
	}else{
		this.outfit = 'black lace'
	}
	console.log(5)
	o.body += `kendra lust wear ${this.outfit} and suck it down >>> ${this.pos} style`;
})


app.listen(8081)
