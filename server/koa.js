'use strict'

var koa = require("koa")
var router = require("koa-router")()
var app = new koa();
// var router = new Router();


app.use(router.routes()).use(router.allowedMethods())

app.use(async(o,next) => {
	o.body = `i am zmz, and i say: `;
	await next();
})


router.use("/", (o, next) =>{
	this.type = 'stockings';
	next();
})
app.use(async (o, next) => {
	await next();
	o.body += 'black fish net with kendra lust rount buttom'+o.url
})

router.get("/api/rr",async (o, next) =>{
	this.type = 'black stockings';
	o.body += '啊哈，我回来啦 rr'
	await next()
	console.log(" ************************ ", o);
	// next()
})

app.use(async (o, next) =>{
	this.bitch = "kendra lust"
	if(!this.type){
		this.type = 'fish net'
	}
	await next()
	o.body += `${this.bitch} : ${this.power} : ${this.type} : ${o.url}`
})

app.use((o, next) =>{
	// console.log(o);
	if(o.url.indexOf("rr") !== -1){
		this.power = "lusting"	
	}else{
		this.power = 'sucking'
	}
	// o.body = `${this.bitch} : ${this.power} : ${this.type} : ${o.url}`
})

// app.use(async (o, next) =>{
// 	this.power = "doggle"
// 	if(o.query.age === '30'){
// 		o.body ="只要one里不设置o.body，我就要返回"
// 		this.power = "creampie"
// 		this.type = 'awsome!'
// 	}else{
// 		await next()
// 	}
// 	o.body ="只要one里不设置o.body，我就要返回"

// })
// app.use(async (o, next) =>{
// 	this.type = "ass";
// 	o.body = o.query.name;
// })


app.listen(8081)
