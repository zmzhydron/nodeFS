
var events = require('events');
var util = require("util");
var gm = require('gm').subClass({imageMagick: true});
// var gm = require('gm')
var fs = require("fs")
// var img = require("images")

// function fuckyou(){
// 	events.EventEmitter.call(this);
// }
// util.inherits(fuckyou, events.EventEmitter);

// var eve = new fuckyou();
// eve.on("hehe", function(resp){
// 	console.log("trigger");
// 	console.log(resp.name)
// })
// eve.emit("hehe", { name :"zhangmingzhi"})

gm("D:/1481117013024.jpg")
.resize(100,100,"!")
.write("D:/resize100.jpg", err => {
   if(err){
      console.log("err", err)
   }else{
      console.log("haha")      
   }
})
// .stream("D:/resize.jpg", function(err, output, outerr){
//    if(err){
//       console.log("err", err)
//    }else{
//       var wr = fs.createWriteStream("D:/resize.jpg");
//       output.pipe(wr);
//    }
// })
// img(`D:/1481117013024.jpg`)
// .size(300,300)
// .save(`D:/11.jpg`,{
// 	quality: 100
// })