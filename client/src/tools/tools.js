
var tools = {
	hi: function(){
		return "HELLO!!"
	},
	zoo: function(gen, value){
		return new Promise( (resolve, reject) => {
			var g = gen(value);
			function core(g,value){
				var r = g.next(value);
				console.log(r);
				if(r.done){
					console.log(value)
					resolve(value);
				}else{
					r.value.then( val => {
						core(g,val);
					}).catch( val => {
						console.warn("init error made by zoo: ", val);
						reject(" reject error by zoo!! ")
					})
				}
			}
			core(g);
		})
	}
}

export {tools}