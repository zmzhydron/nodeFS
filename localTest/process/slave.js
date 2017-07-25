var fs = require("fs");
var { Writable } = require("stream")

//使用写流来进行子进程和父进程的流通信，通常用于数据量比较大的场景;
class WR extends Writable{
	constructor(ops){
		super(ops);
		this.data = [];
	}
	_write(data, dev, callback){
		process.send(data.toString('utf8'))
		this.data.push(data);
		callback();
	}
}
process.on("message", (data, obj) => {
	if(data === 'net'){
		obj.on("connection", socket => {
			socket.end("fuckyou")
		}) 
	}
})
var wr = new WR();
var cr = fs.createReadStream('C:/zmzNode/hehe.txt');
cr.on('data', (chunk) => {
	var r = wr.write(chunk);
	console.log(chunk.toString());
	if(!r){
		cr.pause();
	}
})
wr.on("drain", (err) => {
	cr.resume();
})
cr.on("end", (err, data) => {
	console.log("!!!!!!!!!!!!!")
})
process.on("exit", data=>{
	console.log("master want to me to kill my self")
})
