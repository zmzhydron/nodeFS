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
	}
}