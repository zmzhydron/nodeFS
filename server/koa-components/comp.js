var path = require("path")
var fs = require("fs")
var childProcess = require("child_process")
var photoprocess;
var infoProcess;
module.exports = {
	lusting: (o, next) => {
		console.log(o)
		o.body = "fucking nice yeah!!!"
	},
	upload: function(){
		return async function upload(o,next){
			console.log(o.req.file);
			let file = o.req.file;
			o.body = await new Promise( (resolve, reject) => {
				fs.rename(file.path, file.destination+"\\"+file.originalname, err => {
					if(err){
						// reject("error bitch")
					}
					resolve(`current path @ : ${path.join(__dirname, "../shitbird")}`);
				})
			})
		}
	},
	download: function(){
		return async function download(o,next){
			o.body = await new Promise( (resolve, reject) => {
				var src = path.join(__dirname,"../../localtest/12-5.png");
				var rs = fs.createReadStream(src);
				o.set({
					'Content-Type': 'application/octet-stream',
					'Content-Disposition': `attachment;filename=123.png`
				})
				resolve(rs);
			})
		}
	},
	getPhoto: function(){
		return async function getPhoto(o,next){
			if(!photoprocess){
				photoprocess = childProcess.fork(path.resolve(__dirname,'../childProcess/getFile.js'))
			}
			console.log("comps.js: "+photoprocess.pid)
			let { start, end } = o.request.body
			photoprocess.send({
				type: 'request',
				start,
				end,
			})
			var ioError = '@@';
			if(o.io){
				o.io.emit("soc", `@@@@@@@@@@@ ${o.io.id}`)
			}else{
				ioError = "$$$"
			}
			o.body = await new Promise( (resolve, reject) => {
				photoprocess.on("message", msg => {
					let { data: list = [], total = 0, morePhoto = 0 } = msg;
					resolve({
						list,
						total,
						ioError,
					})
				})	
			})
			// await next();
		}
	},
	initPhotos: function(){
		return async function(o,next){
			if(!infoProcess){
				infoProcess = childProcess.fork(path.resolve(__dirname,'../childProcess/getFileInfo.js'))
			}
			console.log(infoProcess.pid, "infoProcess.pid")
			infoProcess.send("gogo")
			o.body = await new Promise((resolve, reject) => {
				infoProcess.on("message", data => {
					let { status, msg } = data;
					data.socID = o.io.id;
					o.io.emit("heartbeat", JSON.stringify(data))
					if(status === "1"){

					}else if(status === '2'){
						resolve("initPhotos done")
					}else{

					}
				})
			})
		}
	},
	socketOne: function(){
		// var io = require('socket.io')(server)
	}
}