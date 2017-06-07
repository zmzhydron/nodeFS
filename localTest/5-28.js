//@zmz 练习： 测试Co和Promise
//promise
//6 7 12 20 26 27 11

function p1(value){
	return new Promise( (resolve,reject) => {
		setTimeout( value => {
			resolve("p1: "+value);
		},1000, value)
	})
}
function p2(value){
	return new Promise( (resolve,reject) => {
		setTimeout( value => {
			resolve(value+" and welcome");
		},1000, value)
	})
}
function p3(value){
	return new Promise( (resolve,reject) => {
		setTimeout( value => {
			resolve(value+" to the new world!!!");
		},1000, value)
	})
}

// var p11 = p1("zhangmingzhi");
// p11.then( value=> {
// 	return p2(value)
// }).then( value => {
// 	return p3(value)
// }).then( value => {
// 	console.log(value)
// })

//@implement co

function run(gen){
	return function(value){
		return new Promise( (resolve, reject) => {
			var g = gen(value);
			var r = g.next();
			function auto(value){
				if(r.done){
					resolve(value);
				}else{
					//@判断是否是promise，如果不是，根据情况编辑成promise

					isPromise(r.value).then( value => {
						r = g.next(value);
						auto(value)
					})
				}
			}
			auto();
		}) 
	}
	//@check 是否是promise，如果是，立刻返回，不是重新包装成promise
	function isPromise(some){
		if(some.constructor === '[Function: Promise]'){
			return some;	
		}
		//目前只做原始类型的值,ps string or number
		return Promise.resolve(some);
	}
}
function *gen(value){
	var a = yield p1(value);
	var jam = yield a+" fucking awesome"
	var b = yield p2(jam);
	var c = yield p2(b);
}
// var result = run(gen)("zhangmingzhi");
// result.then( value => {
// 	console.log(value);
// })

var obj = {
	// then: function(resolve){
	// 	resolve("zhangmingzhi")
	// }
	name: "zhangmingzhi"
}
obj = p1("asdf");
Promise.resolve(obj).then( val => {
	console.log(val)
})