'use strict'

var koa = require("koa")
const app = new koa();

app.use(async (o, next) =>{
	o.set("one", "zhangmingzhi")
	o.query.name = "sjb"
	this.bitch = "kendra lust"
	await next()
	o.body = `${this.bitch} : ${this.power} : ${this.type}`
})
app.use(async (o, next) =>{
	o.set("two", "is")
	o.query.age = "30";
	this.power = "doggle"
	if(o.query.name === 'sjb'){
		console.log(o.query.name, " *&************ ");
		o.body ="只要one里不设置o.body，我就要返回"
	}else{
		await next()
	}
	o.body ="只要one里不设置o.body，我就要返回"

})
app.use(async (o, next) =>{
	o.set("three", "best")
	this.type = "ass";
	o.body = o.query.name;
})
app.listen(8081)
