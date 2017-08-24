var path = require('path')
var fs = require("fs");
var spawn = require('child_process').spawn;
var a = 'C:\Users\zmz\Desktop\stuff\cpu.txt'
var aa = path.resolve(__dirname, "../../cpus.txt")
var bb = path.relative(__dirname, aa)
var cc = path.join(__dirname, "cpus.txt")
var dd = path.resolve(__dirname, bb)
var ee = path.normalize(a)
var ff = path.win32.join('C:/Users/zmz/Desktop/', '/stuff/cpu.txt')
// console.log(aa, " *******resolve******* ");
// console.log(bb, " *******path.relative******* ");
// console.log(cc, " *******path.join******* ")
// console.log(ee, " *******path.normalize******* ")
// console.log(ff, " ***************************")
fs.readFile(bb, (err, data) => {
	if(err){
		// console.log(err, "  $$$ ")
	}else{
  	// console.log(data.toString("utf8"))
	}
})

// console.log(path.resolve())
// console.log(process.env.PATH.split(path.delimiter))
// console.log(process.env)


// var bf1 = Buffer.from("zhangmingzhi")
// var bf2 = Buffer.alloc(20,"a")
// console.log("********buffer test********")
// console.log(bf1)
// console.log(bf2,bf2.toString())
// console.log("********buffer end********")

function getFixNum(num){
	var num = parseFloat(num);
	if(isNaN(num)){
		return num;
	}
	var fixNumber = 0;
	if(/(\..+)/g.test(num+"")){
		var binggo = (RegExp.$1+"").split("");
		binggo.shift();
		var index = binggo.reduce( (a,b) => a + parseInt(b),0) === 0 ?  0 : binggo.length;
		fixNumber = Array.from({length: index-1}).reduce( (a,b) => 10*a, 10);
	}
	return fixNumber;
}
function parseNum(fix){
	return function(number){
		var number = parseFloat(number);
		if(fix === 0 || fix === undefined){
			return number;
		}
		return number*fix;
	}
}
function getnumbers(x,y){
	var maxFixedNum = (Math.max(getFixNum(x),getFixNum(y)));
	var xr = parseNum(maxFixedNum)(x);
	var yr = parseNum(maxFixedNum)(y);
	return [xr,yr,maxFixedNum];
}
function add(x,y){
	var [a,b,c] = getnumbers(x,y);
	console.log(a,b,c)
	return (a+b)/c;
}
function division(x,y){
	var [a,b,c] = getnumbers(x,y);
	console.log(a,b,c)
	return (a/b);
}
function multiple(x,y){
	var [a,b,c] = getnumbers(x,y);
	console.log(a,b,c)
	return (a*b)/(c*c);
	// return x*y;
}
function minus(x,y){
	var [a,b,c] = getnumbers(x,y);
	console.log(a,b,c)
	return (a-b)/c;
}

function compose(){

}
console.log(minus(10.003,0.02), "yeah");
const abcd = [1,2,3,4,5]
abcd[2] = {
	name: "purr"
}
abcd.splice(0,1,"fuckyou");
console.log(abcd)

function convertUrl(url){
	console.log(url," $$$$$$ ")
	return url.replace(/\\/g,"@")
}
var rela = path.relative("C:\\Users\\zmz\\Desktop\\W\\C09\\src\\components\\Content\\CreateCase\\CaseTable.jsx", "C:\\Users\\zmz\\Desktop\\W\\C09\\src\\redux\\CreatCase\\CaseAnimation\\CaseAnimation.actions.jsx")
console.log(rela)
function aaaa(a){
	a = {
		skill: "Code"
	}
	console.log(a)
}
var obja = {
	skill: "eat shit fucks"
}


function pro1(){
	return new Promise( (resolve, reject) => {
		resolve('111')
	})
}
function pro2(){
	return new Promise( (resolve, reject) => {
		try{
			console.log(zmz)
		}catch(e){
			console.log("promise handle errors")
			reject(e)
		}
	})
}
function pro3(){
	return new Promise( (resolve, reject) => {
		resolve('333')
	})
}
async function hehe(name){
	var r;
	try{
		r = await pro1();	
		r = await pro2();	
		r = await pro3();	
	}catch(e){
		console.log("async catch route")
		r = e;
	}
	// r = await pro1();	
	// r = await pro2();	
	// r = await pro3();	
	return r;
}

hehe("zhangmingzhi").then( val => {
	console.log(val, "$$$$$$$$$$$$$$")
	console.log("PPPPPPPPPPPPPPPPPPPPP")
	aaaa(obja);
	console.log(obja)
}).catch( val => {
	console.log(val, " ~~~~~~~~~~~~ ")

})

let doSth = new Promise((resolve, reject) => {
  console.log('hello');
  resolve();
});

setTimeout(() => {
  doSth.then(() => {
    console.log('over');
  })
}, 2000);


