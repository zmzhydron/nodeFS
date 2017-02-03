var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var fs = require("fs");

var chat = require("./chat.js");
var files = require("./file.js");
console.log('__dirname',__dirname);


/*
	@zmz 17-2-2 在客户端加载socket.io的时候，需要外链引入js，这个外链的js就是在express和socketIO 合并启动后添加到了服务器的静态文件中
	但是前面“/socket.io/socket.io.js”这段代码的路径是相对的，前面默认还有服务器的地址，这里我们监听的是localhost:8080，
	所以就要在前面加上localhost:8080，避免出现我们使用webpack服务器，端口和express的服务器端口不一致，
	导致“/socket.io/socket.io.js”前面加载的是webapck服务器地址，让其找不到资源，导致加载失败；
*/
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

server.listen("8080", function(){})

app.post("/api/getFiles" , function(req, res){
	console.log(req.body);
	var path = req.body.path;
	res.send(files.getFiles(path));
})
var rs;
var userCount = 0;
io.on('connection', function (socket) {
  socket.on('requestMedia', function(req){
  	console.log(req);
  	var src = req.src;
  	rs = fs.createReadStream(src);
  	rs.on('data', function(data){
  		console.log(data);
  		io.emit("media",data);
  	})
  })
  chat.start(socket);
  
  // socket.on("pauseMedia", function(req){
  // 	console.log(`rs.pause();`)
  // 	rs.pause();
  // })
  // socket.on("resumeMedia", function(req){
  // 	rs.resume();
  // })
});