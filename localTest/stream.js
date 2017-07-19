var { Readable, Writable, Duplex  } = require("stream")
var ary = [1,2,3,4,4,5,6,6,'z','m','z','#'];
var me = 'zhangmingzhi';
class Read extends Readable{
	constructor(ops){
		super(ops)
		this.datas = ary;
	}
	_read(){
		for(var j of this.datas){
			this.push(j+"");
		}
		this.push(null);
	}
	setdata(data){
		this.datas = data;
	}
} 
class Write extends Writable{
	constructor(){
		super();
		this.datas = [];
	}
	_write(chunk,encoding,callback){
		// var str = chunk.toString(dev)
		this.datas.push(chunk.toString());
		if(chunk.toString() === 'm'){
			// next(throw new Error("fuckyoubitch"))
			callback(new Error('故意报错!!'))
			// callback()
		}else{
			callback();	
		}
	}
}
class Dup extends Duplex{
	constructor(ops){
		super(ops)
		this.list = ary;
		this.results = [];
	}
	_read(){
		for(var s of this.list){
			this.push(s.toString())
		}
		this.push(null)
	}
	_write(chunk,dev,callback){
		this.results.push(chunk.toString())
		callback();
	}
}
var dr = new Dup();
var dw = new Dup();

dr.on('data', data =>{
	dw.write(data.toString())
})
dr.on('end', (err, data) => {
	dw.end();
})
dw.on("finish", (err, data) => {
	console.log(dw.results, `dw.on("finish",`)
})

var rs = new Read();
rs.setdata(Array.from(me))
var ws = new Write();
rs.on("data", (data) => {
	if(data.toString() === '@'){
		// ws.end("BitCH");
		// rs.end();
	}else{
		ws.write(data.toString())	
	}
	
})
rs.on("end", (err,data) => {
	if(err){
		console.log('!!!!!!!!!!')
	}else{
		console.log(" end ");	
		ws.end();
	}
})
// rs.pipe(ws)
ws.on("finish", (err, data) =>{
	console.log(ws.datas," ~~~~~~~~ ")
})