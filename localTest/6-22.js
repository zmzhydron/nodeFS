'use strict'
//co test'
var P1 = function(val){
	return new Promise( (resolve, reject) => {
		setTimeout( val => {
			resolve(`P1 ARE ${val}`)
		},400, val)
	})
}
var P2 = function(val){
	return new Promise( (resolve, reject) => {
		setTimeout( val => {
			resolve(`P2 ARE ${val}`)
		},400, val)
	})
}
var P3 = function(val){
	return new Promise( (resolve, reject) => {
		setTimeout( val => {
			resolve(`P3 ARE ${val}`)
		},400, val)
	})
}
var P4 = function(val){
	return new Promise( (resolve, reject) => {
		setTimeout( val => {
			resolve(`P4 ARE ${val}`)
		},400, val)
	})
}
function co(gen,startval){
	return new Promise(( resolve, reject) => {
		var g = gen(startval);
		var val = startval;
		function innerCore(g){
			let r = g.next(val)
			if(r.done){
				resolve(val)		
			}else{
				let rv = checkPromise(r.value);
				rv.then( vl => {
					val = vl;
					innerCore(g);
				})
				
			}
		}
		innerCore(g);
	})
	function checkPromise(val){
		if(typeof val === "number" || typeof val === "string"){
			return Promise.resolve(val)
		}
		// if(typeof val === 'object'){

		// }
		return val;
		if(val.constructor === '[Function: Promise]'){
			
		}		
	}
}
function *gen(val){
	var a = yield P1(val);
	// var b = yield P2(a);
	var b = yield a+"十几块吧";
	var c = yield P3(b);
	var d = yield P4(c);
}
var cc = co(gen, "zmz");
cc.then( val => {
	console.log(val)
})
// console.log(typeof '11')
// console.log(1 instanceof Number)
