'use strict'

async function b(){
	var r = await new Promise( (resolve, reject) => {
		let name = `20140724_152156.jpg`;
		// let newname = name.split(".").map( (item,index) => {
		// 	if(index === 0){
		// 		item += "_resize500"
		// 	}
		// 	return item
		// }).join(",");
		if(/(\.)/.test(name)){
			console.log(RegExp.$1, '>>>@@@@@@@"')
		}
		let newname = name.replace(/(\.)/, "_resize500"+RegExp.$1);
		resolve(newname)
	})
	return r
}

async function a(){
	var r;
	// try{
	// 	r = await new Promise( (resolve, reject) => {
	// 		reject({
	// 			message: `hello async await reject`
	// 		}) //reject 中的值需要在catch中通过e来获取，并赋值为 r
	// 		// throw new Error("only"); //throw new Error也是一样
	// 		// console.log(buchunzaidezhi) //故意报错也一样
	// 	})
	// }catch(e){
	// 	r = e.message;
	// }
	// r = await new Promise( (resolve, reject) => {
	// 	// reject(`hello async await reject`) //reject 中的值需要在catch中通过e来获取，并赋值为 r
	// 	throw new Error("only"); //throw new Error也是一样
	// 	console.log(buchunzaidezhi) //故意报错也一样
	// })
// try{
// 	r = await new Promise( (resolve, reject) => {
// 		// resolve(`hello async await resolve`)
// 		throw new Error("only"); //throw new Error也是一样
// 		console.log(errror)
// 	})
// }catch(e){

// }
	// r = await new Promise( (resolve, reject) => {
	// 	// reject(`hello async await reject`)
	// 	// throw new Error("only"); //throw new Error也是一样
	// 	console.log(errror)
	// })
	
	r = await new Promise( (resolve, reject) => {
		console.log(" execude")
		resolve(`hello async await resolve`)
		// throw new Error("only"); //throw new Error也是一样
		console.log(errror)
	})
	r = await new	Promise( (resolve, reject) => {
		 b().then( val => {
		 	resolve( val)
		 })		
	})
	return r;
}
// return r;
// var r = await new Promise( (resolve, reject) => {
// 	reject(`hello async await reject`)
// 	setTimeout( val => {
// 		// resolve(`hello async await`)
		
// 	},1000)
// })
a().then( val => {
	console.log(`resolve: ${val}`)
}).catch( val => {
	console.log(`reject: ${val}`)
})