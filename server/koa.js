'use strict'

var koa = require("koa")
var router = require("koa-router")()
var app = new koa();
var components = require("./koa-components/1.js")
var multer = require("koa-multer");
var path = require("path")
var fs = require("fs");
var upload = multer({ dest: path.join(__dirname, "../shitbird")})

app.use(router.routes()).use(router.allowedMethods())

app.use(async(o,next) => {
	this.key = "1"
	o.body = `i am zmz, and i say:`;
	await next();
	// o.body += " :D"
})
router.use("/", async (o, next) =>{
	o.body = " something eles"
	this.isrr = false;
	await next();
})
app.use(async (o, next) => {
	// await next();
	
	await next();
})

router.get("/api/rr",async (o, next) =>{
	// console.log(o)
	// o.body = "fuck you bitch"
	this.isrr = true;
	await next();
	// o.body += ` kendra lust wear ${this.outfit} and suck it down`;
})
router.post("/api/upload", upload.single("fuckyoutoo"),  async (o, next) =>{
	
	console.log(o.req.file);
	// o.body = path.join(__dirname, "../shitbird");	

	let file = o.req.file;
	o.body = await new Promise( (resolve, reject) => {
		fs.rename(file.path, file.destination+"\\"+file.originalname, err => {
			if(err){

			}
			reject("fuckyou bitch")
			resolve(`current path @ : ${path.join(__dirname, "../shitbird")}`);
		})
	})
	// await next();
})

app.use(async (o, next) =>{
	//one
	this.key += '2'
	console.log(o.url, this.isrr);
	if(this.isrr){
		o.body = 'hehe'
		this.isrr = false;
	}else{
		await next();		
	}
})

app.use( async (o, next) =>{
	if(this.isrr){
		this.outfit = "nothing"	
	}else{
		this.outfit = 'black fish net'
	}
	console.log(o.url, " *********** ")
	o.body += ` kendra lust wear ${this.outfit} and suck it down ${this.key}`;
})


app.listen(8081)
