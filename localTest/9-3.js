'use strict'
var fs = require("fs")
var path = require("path")
/*
	async promise 并发，按顺序读取测试;

*/



function pro1(val){
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			console.log("1 done")
			resolve(val)
		},3000);
	})
}
function pro2(val){
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			console.log("2 done")
			resolve(val)
		},1000);
	})
}
function pro3(val){
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			console.log("3 done")
			resolve(val)
		},2000);
	})
}

var ll = [1,2,3,4,5];
for(let [a,b] of ll.entries()){
	// console.log(a,b)
}
var st = new Date().valueOf();
async function hehe(){
	let list = [pro1, pro2, pro3];
	let _rl = [];
	for(let i of list){
		_rl.push(await i());
	}
	return _rl;
}
// hehe().then( val => {
// 	console.log(val, 'cost ', new Date().valueOf() - st);
// })

function run(gen, val){
	var g = gen(val);
	return new Promise( (resolve, reject) => {
		function core(val){
			var r = g.next(val);
			if(r.done){
				resolve(r.value);
			}else{
				r.value.then( val => {
					core(val);
				})
			}
		}
		core();	
	})
}

function *gen(val){
	var r = "";
	r = yield pro1(val);
	r = yield pro2(r+" zao");
	r = yield pro3(r+" shang hao");
	console.log(r, "!!!!!!")
	return r;
}
// run(gen, "zhangmingzhi").then( val => {
// 	console.log(val, " ************* ");
// })
// let pro = function(){
// 	let list = [pro1(), pro2(), pro3()];
// 	return Promise.all(list)
// }
// pro().then( val => {
// 	// val.forEach( item => {
// 	// 	item.
// 	// })
// 	console.log(val)
// })

function removeDir(dir){
	let files = fs.readdirSync(dir);
	files.forEach( (item, index) => {
		let src = path.resolve(dir,item);
		if(fs.statSync(src).isDirectory()){
			removeDir(src)
		}else{
			fs.unlinkSync(src)
		}
	})
	fs.rmdirSync(dir);
}
async function b(){
	await "bb"
}
async function c(){
	if(5>3){

	}else{
		console.log("2222")
		await "cc"
	}
}
async function a(){
	await c();
	console.log('111111111')
	return await b()
}
a().then( val => {
	console.log(val);
})