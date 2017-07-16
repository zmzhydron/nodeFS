var path = require("path")
var fs = require("fs");

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
	}
}