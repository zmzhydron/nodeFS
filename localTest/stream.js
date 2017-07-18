var { Readable, Writable  } = require("stream")
var ary = [1,2,3,4,4,5,6,6,'z','m','z','#'];
class Read extends Readable{
	constructor(ops){
		super(ops)
	}
	_read(){
		for(var j of ary){
			this.push(j+"");
		}
		this.push("#");
		this.push(null);
	}
} 
class Write extends Writable{
	constructor(){
		super();
		this.datas = [];
	}
	_write(chunk,dev,next){
		this.datas.push(chunk+"");
		next();
	}
}
var rs = new Read();
var ws = new Write();
rs.on("data", (err,data) => {
	console.log(err.toString())
	ws.write(err.toString())
	if(err.toString() === '#'){
		// ws.end();
		rs.close();
	}
})
rs.on("finish", (err,data) => {
	if(err){
		console.log('!!!!!!!!!!')
	}else{
			console.log(data, " finish ");		
	}
})