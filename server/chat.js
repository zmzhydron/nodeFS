/*
	聊天室程序使用socket.io
*/
var events = require("events");
var util = require('util');

function EmitterC(){
	events.EventEmitter.call(this)
}
util.inherits(EmitterC, events.EventEmitter);

var emitter = new EmitterC();

var userCount = 0;
var chatns;

var chat = {
	start: function(io){
		//创建chat namespace
		//TODO 根据用户登录与否来创建不同的rooms
		chatns = io
		.of('/chat')
		.on('connection', function (socket) {
			chat.functor(socket);
			console.log(socket)
			userCount++;
			emitter.emit("userCountChange", {userCount: userCount});
		});
	},
	functor: function(socket){
		emitter.on('userCountChange', function(resp){
			var userCount = resp.userCount;
			socket.broadcast.emit("userSumChange", {
				userCount: userCount
			})
			socket.emit("userSumChange", {
				userCount: userCount
			})
		})
		socket.on("disconnect", function(a,b){
			console.log("*************************disconnect****************************")
			userCount--;
			emitter.emit("userCountChange", {userCount: userCount});
		})
		socket.on('newMessage', function (data) {
			console.log("*id...........*")
			console.log(socket.id);
			console.log(chatns);
		  var name = socket.username;
		  var msg = data.msg;
		  socket.broadcast.emit('broadcast',{
		  	name: name,
		  	msg: msg
		  })
		  socket.emit('selfTalk',{
		  	name: name,
		  	msg: msg,
				isSelf: true
		  })
		})
		socket.on('userLogin', function(data){
			socket.username = data.username;

			// console.log(data.username, 'data.username');
			socket.emit("loginSuccess", {
				msg: "login sucesss"
			})
		})
	}
}

module.exports = chat;