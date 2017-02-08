/*
	player使用socket.io
*/
var events = require("events");
var util = require('util');

function EmitterC(){
	events.EventEmitter.call(this)
}
util.inherits(EmitterC, events.EventEmitter);

var emitter = new EmitterC();

var userCount = 0;
var rs;
var player = {
	start: function(io){
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
		})
	}
}

module.exports = player;