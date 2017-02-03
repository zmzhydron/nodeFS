/*
	聊天室程序使用socket.io
*/
var userCount = 0;
var chat = {
	start: function(socket){
		socket.on('newMessage', function (data) {
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
			userCount++;
			console.log(data.username, 'data.username');
			socket.emit("loginSuccess", {
				msg: "login sucesss"
			})
			socket.broadcast.emit("userSumChange", {
				userCount: userCount
			})
			socket.emit("userSumChange", {
				userCount: userCount
			})
		})
	}
}

module.exports = chat;