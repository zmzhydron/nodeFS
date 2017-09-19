var fs = require("fs")
var path = require("path")

fs.readFile(path.resolve(__dirname, "./cluster.js"), (err, data) => {
	if(!err){
		console.log("ok");
	}else{
		console.log()
	}
})

setImmediate( function(){
	console.log(2)
	setImmediate( function(){
		console.log(4);
		setImmediate( function(){
			console.log(5);

		})
	})

})
var aa = setInterval( function(){
	console.log('3')
},1000)
process.nextTick( function(){
	console.log("1")
})

setTimeout(() => {
	setTimeout( () => {
		console.log('later')
	},0)
	setImmediate( () => {
		console.log(` see you `)
	})
})
setTimeout( () => {
	aa.unref();
},3000);

// setTimeout( () => {
// 	aa.ref();
// 	console.log("~~~~~~~~~~~")
// },5000);





    setImmediate(function () {
      setTimeout(function () {
         console.log('zaaaaaaaaaaaaaaaaa');
      },0);

      setImmediate(function () {
         console.log('bbbbbbbbbbbbbb');
      })
    })




