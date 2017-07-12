'use strict'



async function a(){
	var b = 100;
	var r = await new Promise( (resolve, reject) => {
		setTimeout( () => {
			resolve('hello async await')
		},1000)
	})
	console.log(r);
	console.log(b)
}
a()