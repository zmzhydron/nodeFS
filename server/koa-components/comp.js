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
			console.log(photoprocess.pid)
			let { start, end } = o.request.body
			photoprocess.send({
				type: 'request',
				start,
				end,
			})
			o.body = await new Promise( (resolve, reject) => {
				photoprocess.on("message", msg => {
					let { data: list = [], total = 0, morePhoto = 0 } = msg;
					resolve({
						list,
						total,
					})
				})	
			})
			// await next();
		}
	},
	getFileInofs: function(){
		if(!infoProcess){
			infoProcess = childProcess.fork(path.resolve(__dirname,'../childProcess/getFileInfo.js'))
		}
		console.log(infoProcess.pid, "infoProcess.pid")
		infoProcess.send("gogo")
		infoProcess.on("message", msg => {
			console.log(`comps.js,`,msg);
		})
	},
	socketOne: function(){
		// var io = require('socket.io')(server)
	}
}