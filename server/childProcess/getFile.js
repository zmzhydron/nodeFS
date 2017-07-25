var fs = require("fs")
var path = require("path")

const url = "C:/Users/zmz/Desktop/PIC/T";
const server_url = path.resolve(__dirname,"../../client/photolist")
process.on("message", msg => {
	let { start, limit = 5 } = msg;
	start = parseInt(start);
	limit = parseInt(limit)
	try{
		fs.statSync(server_url)
	}catch(e){
		fs.mkdirSync(server_url);
	}
	fs.readdir(url, (err, data) => {
		let list = [];
		console.log(start, start + limit);
		let morePhoto = 0;
		if(start+limit < data.length){
			data.slice(start, start + limit).forEach( (item, index) => {
				try{
					fs.statSync(server_url+"/"+item);
				}catch(e){
					fs.symlinkSync(url+"/"+item, server_url+"/"+item);
				}
				list.push(path.relative(path.resolve(__dirname,"../../client/src"),server_url+"/"+item));
			})
			morePhoto = 1;
		}
		process.send({
			data: list,
			total: data.length,
			morePhoto,
		})	
	})
})
