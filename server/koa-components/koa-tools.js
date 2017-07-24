//koa的公用方法

var tools = {
	success: function(data){
		return {
			errorCode: 1,
			data: data
		}
	}, 
	err: function(msg, o, returnError){
		if(returnError){
			o.status = 500;
		}
		return {
			errorCode: 0,
			msg: msg
		}
	},
	test: function (){
		return async function test(o, next){
			// var a;
			// try{
			// 	return await new Promise( (resolve, reject) => {
			// 		throw new Error(" test throw error")
			// 		reject("test reject");
			// 		// resolve(" test resolve")
			// 		o.pos = " aaaaaaaaaa "
			// 		next();
			// 	})
			// }catch(e){
			// 	console.log(e, "  ********************* ")
			// 	next();
			// }
			// return a;
			await new Promise( (resolve, reject) => {
				// throw new Error(" test throw error")
				o.pos = " doggy ";
				// reject("test reject");
				resolve(" test resolve")
				
			})
			await next();

		}
	}
}
module.exports = tools;