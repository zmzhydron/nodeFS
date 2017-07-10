'use strict'

var koa = require("koa")
const app = new koa();

app.use(function* one(next){
	this.set("one", "zhangmingzhi")
	this.query.name = "sjb"
	yield next;
	console.log("1111111111")
	this.query.name = "sjb@"
	this.body = this.url+"@@@"
})
app.use(function* two(next){
	this.set("two", "is")
	this.query.age = "30";
	if(this.query.name === 'sjb'){
		console.log(this.query.name, " *&************ ");
		// this.body ="提前回来啦"
	}else{
	}
	yield next;
	console.log("22222222222")
	this.body ="提前回来啦"

})
app.use(function* three(next){
	this.set("three", "best")
	// console.log(this);
	console.log("*************************************************", this.url)
	console.log(this.body)
	this.body = this.query.name;
	console.log("333333333333")
})
app.listen(8081)
