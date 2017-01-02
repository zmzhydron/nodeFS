var express = require("express");
var app = express();
console.log('111')
var server = app.listen("8080", function(){
	console.log(`fuck you`);  
})

app.get("/api/fuckyou" , function(req, res){
	res.send({
		name: "shit1",
		call: "bird",
		age: 28
	})
})
app.get("/api/suckyou" , function(req, res){
	res.send({
		name: "suckyou",
		call: "suckyou",
		age: 'suckyou'
	});
})