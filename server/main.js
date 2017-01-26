var express = require("express");
var app = express();
var files = require("./file.js")
console.log('111',__dirname);
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
	// console.log(res, "************");
	// res.send("suck you")
	res.send(files.test());
})