var fs = require("fs");
var os = require("os");
var path = require("path");
var koa = require("koa");
var koaStatic = require("koa-static");
var request = require("request");
var superagent = require("superagent")
var util = require("util")
var koabody = require("koa-body")

var app = new koa()
app.use(koaStatic(path.resolve(__dirname, '../../build/')))


function proxy(obj){
	let { proxUrl, } = obj;
	return async (o,next) => {
		let { rawHeaders: headersList, url, method, } = o.req;
		let headers = {};
		headersList.forEach( (item, index, list) => {
			if(index % 2 === 0 ){
				headers[item] = "";
			}else{
				headers[list[index-1]] = item;
			}
		})
		let callback = (resolve, reject) => (err, res) => {
			if(err){
				reject(err)
			}else{
				resolve(res.body)
			}
		}
		let requestPath = `${proxUrl}${url}`;
		o.body = await new Promise( (resolve, reject) => {
			if(method === 'GET'){
				let querys = url.split("?")[1];
				superagent
				.get(requestPath)
				.set(headers)
				.query(querys)
				.end(callback(resolve, reject))
			}else if(method === "POST"){
				// superagent
				// .post(requestPath)
				// .set(headers)
				// .send(querys)
				// .end(callback(resolve, reject))
				console.log(o.request.body)
				fs.writeFileSync("./req.json", util.inspect(o.request));
				resolve("不支持的HTTP请求")
			}else{
				resolve("不支持的HTTP请求")
			}

		})
	}
}
app.use(koabody())
app.use(proxy({
	proxUrl: '127.0.0.1:8081'
}))


var server = app.listen(8888);
