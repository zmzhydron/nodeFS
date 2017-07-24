var express = require("express")
var multer  = require('multer')
var upload = multer({ dest: 'shitbird/' })
var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var bodyParser = require('body-parser')
var fs = require("fs")
var path = require("path")
var chat = require("./chat.js")
var player = require("./player.js")
var files = require("./file.js")
var multiparty = require('multiparty')
var util = require('util');
//mongodb connect
var mongodb = require("mongodb")
var moserver = mongodb.Server;
var mongoclient = mongodb.MongoClient;
// var dbfn = require("./db/db.js");
// var dbfn = require("./db/mongoose.js")
/*
	@zmz 17-2-2 在客户端加载socket.io的时候，需要外链引入js，这个外链的js就是在express和socketIO 合并启动后添加到了服务器的静态文件中
	但是前面“/socket.io/socket.io.js”这段代码的路径是相对的，前面默认还有服务器的地址，这里我们监听的是localhost:8080，
	所以就要在前面加上localhost:8080，避免出现我们使用webpack服务器，端口和express的服务器端口不一致，
	导致“/socket.io/socket.io.js”前面加载的是webapck服务器地址，让其找不到资源，导致加载失败；
*/
app.use(bodyParser.urlencoded({ extended: false }));
console.log( path.join(__dirname, "../client"), "  ************  ");
app.use('/src/', express.static(path.join(__dirname, "../buildSrc")))
app.use(express.static(path.join(__dirname, "../client")))

server.listen("3009", function(){});

var globalDb = ""; //初始化的全球db对象;

//6-3 新建服务器后连接db对象

app.post("/api/getFiles" , function(req, res){
	console.log(req.body);
	var path = req.body.path;
	res.send(files.getFiles(path));
})
app.post("/api/readFiles" , function(req, res){
  var path = req.body.path;
  res.send(files.readContent(path));
})
// app.post("/api/connectDb", function(req, res){
// 	var callback = function(err,db){
// 		if(err){
// 			console.log(" lianjie shibai !")
// 			console.log(err);
// 		}else{
// 			console.log(" linejie cheng gong!!")
// 			globalDb = db;
// 		}
// 	}
// 	var body = req.body;
// 	var name = body.name || "zmz",
// 			pwd = body.pwd || "zmz",
// 			dbname = body.dbname || "zmz";
// 	mongoclient.connect(`mongodb://${name}:${pwd}@127.0.0.1:27017/${dbname}`, callback);
// 	res.send(globalDb);
// })

app.post("/api/getCollections", function(req,res){
	dbfn.getCollections(globalDb,res);
})
app.post("/api/insera", function(req,res){
	// dbfn.getCollections(globalDb,res);
})
app.post("/api/addCollection", function(req,res){
	var name = req.body.name;
	var colname = req.body['initCol[name]'];
	var age = req.body['initCol[age]']
	dbfn.addCollections(globalDb,res, {
		name: name,
		initCol: {
			colname: colname,
			age: age
		}
	});
})
app.post("/api/query", function(req,res){
	var collname = req.body.collname || 'zmz';
	var queryname = req.body.queryname;
	console.log(collname)
	dbfn.query(globalDb,res, {
		collname: collname,
		queryname: queryname
	});
})
app.post("/api/queryAndupdate", function(req,res){
	var collname = req.body.collname || 'zmz';
	var queryname = req.body.queryname;
	dbfn.queryAndupdate(globalDb,res, {
		collname: collname,
		queryname: queryname
	});
})
app.post("/api/addCar", function(req,res){
	dbfn.addCar(globalDb,res, req);
})
app.post("/api/updateCar", function(req,res){
	dbfn.updateCar(globalDb,res, req);
})
app.post("/api/deleteCar", function(req,res){
	dbfn.deleteCar(globalDb,res, req);
})
app.post("/api/queryMycar", function(req,res){
	console.log(1)
	dbfn.queryMycar(globalDb,res, req);
})

app.post("/api/one", function(req,res){
	res.send({
		status: "ok",
		url: "two"
	})
})
app.post("/api/two", function(req,res){
	res.send({
		status: "ok",
		url: "getCollections"
	})
})
//upload.single('fuckyoutoo') 用于取得上传的form表单中用于储存文件的字段名称，
//并把上传文件的相关信息添加到req对象中
//这时候，文件已经上传成功了，路径为 var upload = multer({ dest: 'shitbird/' })中的路径
app.post("/api/upload", upload.single('fuckyoutoo'), function(req,res){
	var ps = path.join(__dirname, "../shitbird");
	console.log(req.body);
	//如果前台在form.append中使用了第三个参数，fielname，那么multer会默认使用第三个参数而不是随机生成名称。
	fs.rename(ps+"/"+req.file.filename, ps+"/"+req.file.originalname, function(err){
		if(err){
			res.send("noooo")		
		}
		res.send('yessssssssss')
	})
})

// chat.start(io);
// player.start(io);