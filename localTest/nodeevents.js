'use strickt'

var events = require('events');
var util = require("util");

function fuckyou(){
	events.EventEmitter.call(this);
}
util.inherits(fuckyou, events.EventEmitter);

var eve = new fuckyou();
eve.on("hehe", function(resp){
	console.log("trigger");
	console.log(resp.name)
})
eve.emit("hehe", { name :"zhangmingzhi"})