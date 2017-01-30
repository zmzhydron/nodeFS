'use strict'
var	stream = require("stream");
var readStream = stream.Readable;
var writeStream = stream.Writable;

var testData = [1,2,3,4,5];
class MyreadStream extends readStream{
	constructor(props){
		super();
		this.data = 'zhangmingzhi'.split("");
		this.max = this.data.length;
		this.count = 0;
	}
	_read(){
		if(this.count < this.max){
			this.push(this.data[this.count]);
			this.count++;
		}else{
			console.log("@@@@@@")
			this.push(null);
		}
	}
}


class MywriteStream extends writeStream{
	constructor(props){
		super();
		this.datas = [];
	}
	_write(data, encoding, callback){
		this.datas.push(data.toString("utf8"));
		callback();
	}
}

var rst = new MyreadStream();
var wsr = new MywriteStream();
rst.setEncoding("utf8");
// rst.on('data', function(data){
// 	var r = wsr.write(data);
// 	r = false;
// 	if(!r){
// 		console.log("!")
// 		rst.pause();
// 		// rst.resume();
// 	}
// })
var r = rst.read(),
		rr = [],
		_r;
while(r){
	// _r = r.toString('utf8');
	_r = r;
	rr.push(_r)
	r = rst.read();
	wsr.write(_r);
}

console.log(rr.join(",").replace(/\,/g,""), "read function");
rst.on('end', function(){
	wsr.end();
})
wsr.on("finish", function(data){
	console.log(wsr.datas.join(",").replace(/\,/g, ""), "@@@@@@@@@@@")
})
