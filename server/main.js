var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var fs = require("fs");

var chat = require("./chat.js");
var player = require("./player.js");
var files = require("./file.js");

//mongodb connect
var mongodb = require("mongodb");
var moserver = mongodb.Server;
var mongoclient = mongodb.MongoClient;
var dbfn = require("./db/db.js");
console.log('__dirname',__dirname);


/*
	@zmz 17-2-2 在客户端加载socket.io的时候，需要外链引入js，这个外链的js就是在express和socketIO 合并启动后添加到了服务器的静态文件中
	但是前面“/socket.io/socket.io.js”这段代码的路径是相对的，前面默认还有服务器的地址，这里我们监听的是localhost:8080，
	所以就要在前面加上localhost:8080，避免出现我们使用webpack服务器，端口和express的服务器端口不一致，
	导致“/socket.io/socket.io.js”前面加载的是webapck服务器地址，让其找不到资源，导致加载失败；
*/
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

server.listen("8080", function(){});

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
app.post("/api/connectDb", function(req, res){
	var callback = function(err,db){
		if(err){
			console.log(" lianjie shibai !")
			console.log(err);
		}else{
			console.log(" linejie cheng gong!!")
			globalDb = db;
		}
	}
	var body = req.body;
	var name = body.name || "zmz",
			pwd = body.pwd || "zmz",
			dbname = body.dbname || "zmz";
	mongoclient.connect(`mongodb://${name}:${pwd}@127.0.0.1:27017/${dbname}`, callback);
	res.send(globalDb);
})

app.post("/api/testDb", function(req,res){
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

chat.start(io);
player.start(io);