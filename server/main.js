var express = require("express");
var bodyParser = require('body-parser')
var app = express();
var files = require("./file.js")
console.log('__dirname',__dirname);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
var server = app.listen("8080", function(){})
app.get("/api/fuckyou" , function(req, res){
	res.send({
		name: "shit1",
		call: "bird",
		age: 28
	})
})
app.post("/api/getFiles" , function(req, res){
	console.log(req.body);
	var path = req.body.path;
	res.send(files.getFiles(path));
})