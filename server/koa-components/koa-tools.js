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
			return await new Promise( (resolve, reject) => {
				// throw new Error(" test throw error")
				reject( " test reject");
				resolve(" test resolve")
				o.pos = " aaaaaaaaaa "
				next();
				
			})

		}
	}
}
module.exports = tools;