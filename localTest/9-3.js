'use strict'

/*
	async promise 并发，按顺序读取测试;

*/

function pro1(){
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			resolve('1')
		},3000);
	})
}
function pro2(){
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			resolve('2')
		},1000);
	})
}
function pro3(){
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			resolve('3')
		},2000);
	})
}

var ll = [1,2,3,4,5];
for(let [a,b] of ll.entries()){
	console.log(a,b)
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
hehe().then( val => {
	console.log(val, 'cost ', new Date().valueOf() - st);
})

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