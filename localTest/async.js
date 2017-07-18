'use strict'

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
	return await new Promise( (resolve, reject) => {
		reject(`hello async await reject`)
		throw new Error("only"); //throw new Error也是一样
		console.log(errror)
	})
	// return r;
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