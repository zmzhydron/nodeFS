'use strict'
//generater and promise recap

var P1 = value => {
	return new Promise((resolve, reject) => {
		setTimeout( (value) => {
			resolve(` p1 : ${value}`)
		}, 1000, value);
	})
}
var P2 = value => {
	return new Promise((resolve, reject) => {
		setTimeout( (value) => {
			resolve(` p2 : ${value}`)
		}, 1000, value);
	})
}
var p1 = P1('zmz')
// p1.then( val => {
// 	console.log(` step one is ${val}`)
// 	// return P2(val)
// 	return Promise.resolve({
// 		then: (resolve) => {
// 			resolve("zhangmingzhi1234")
// 		}
// 	})
// }).catch( val => {
// 	console.log(` paragon : ${val} `);
// }).then( val => {
// 	console.log(` finnal is ${val}`)
// })

function *geen(val){
	console.log(`start`)
	var a = yield val;
	console.log(a);
	var b = yield a+"@@";
	console.log(b);
}
var gen = geen('zhangmingzhi');
console.log(gen.next());
// console.log(gen.next('sjb'));
// console.log(gen.next('dashabi'));

function co(gen){
	var g = gen();
}