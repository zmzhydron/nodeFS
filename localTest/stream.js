// new stream test
var { Readable, Writable, Duplex, Transform } = require("stream")
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
			// callback(new Error('故意报错!!'))
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
class Tras extends Transform{
	constructor(options){
		super(options)
	}
	_transform(chunk,dev,callback){
		this.push(`@@@ ${chunk.toString()} @@@`)
		// console.log(chunk, " _transform ")
		callback();
	}
}
var tra = new Tras();
var dr = new Dup();
var dw = new Dup();

// dr.on('data', data =>{
// 	dw.write(data.toString())
// })
// dr.on('end', (err, data) => {
// 	dw.end();
// })
// dw.on("finish", (err, data) => {
// 	console.log(dw.results, `dw.on("finish",`)
// })

var rs = new Read();
rs.setdata(Array.from(me))
var ws = new Write();
rs.on("data", (data) => {
	if(data.toString() === '@'){
		// ws.end("BitCH");
		// rs.end();
	}else{
		// ws.write(data.toString())	
		tra.write(data.toString())
	}
})
// rs.pipe(tra)
tra.on("data", data => {
	ws.write(data.toString())
})
tra.on('finish', (err, data) => {
	// console.log(tra)
	// console.log(`tra.on('finish'`)
})
rs.on("end", (err,data) => {
	if(err){
	}else{
		ws.end();
		tra.end();
	}
})
// rs.pipe(ws)
ws.on("finish", (err, data) =>{
	// console.log(ws.datas," ~~~~~~~~ ")
})

var num = `1,008,275,639,649.71`;
var bbb = 10082751649.7;

var asdf = function(num){
	num = parseFloat(num);
	var mblist = [
	    { key: "GB", value: 1024 },
	    { key: "TB", value: 1024 * 1024 },
	    { key: "PB", value: 1024 * 1024 * 1024 },
	    { key: "EB", value: 1000 * 1024 * 1024 * 1024 }
	]
	
	if (num > 10000) {
			let rtv;
	    mblist.forEach(item => {
	        let r = num / item.value;
	        if (r >= 1 && r < 10000 && !rtv) {
	            rtv = {
	                val: r.toFixed(1),
	                key: item.key
	            }
	        }
	    })
	    return `${rtv.val}${rtv.key}`
	}else{
		return num+"MB";
	}
}
function hehe(_s){
  let reg1 = /\B(?=(\d{3})+$)/gi;
  let reg2 = /\B(?=(\d{3})+\D)/gi;
  let s = _s + "";
  try {
      if (reg2.test(s)) {
          return s.replace(reg2, ",")
      } else if (reg1.test(s)) {
          return s.replace(reg1, ",")
      }
      return _s === Infinity ? 0 : _s;
  } catch (e) {
      return _s === Infinity ? 0 : _s;
  }
}
console.log(hehe(`12314.5GB`))
// console.log(asdf(bbb));
// console.log(asdf(12345));