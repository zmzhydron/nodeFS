var fs = require("fs")
var path = require("path")
var gm = require('gm').subClass({imageMagick: true})

const url = "C:/Users/zmz/Desktop/PIC/T";
const server_url = path.resolve(__dirname,"../../client/photolist")

function statOrReizeFile(resizeSrc, src, filename){
	return new Promise( (resolve, reject) => {
		fs.stat(resizeSrc, (err, data) => {
			let status = 1;
			if(err){
				//创建resize 图片
				gm(src).resize(160,90).write(resizeSrc, (err, data) => {
					if(err){
						resolve({
							status: 0,
							msg: "resize error",
							resizeSrc,
							originSrc: src,
						})
					}else{
						resolve({
							status: 1,
							resizeSrc,
							originSrc: src,
						})
					}
				})
				//创建图片引用;
				fs.symlink(src, server_url+"/"+filename, (err, data) => {
					if(err){
						console.log(`sync error ,filename : ${filename}`)
					}else{
						console.log(`sync complete`)						
					}
				})
			}else{
				resolve({
					status,
					resizeSrc,
					originSrc: src,
				})
			}
			
		})
	})
}
function readDir(src){
	return new Promise( (resolve, reject) => {
		fs.readdir(url, (err, data) => {
			if(err){
				reject("readDir error", err)
			}else{
				resolve(data)
			}
		})
	})
}
function getresizePic(list, obj){
	let { start, limit, url, server_url, } = obj;
	return new Promise( (resolve, reject) => {
		let rtvlist = [];
		list.slice(start, start + limit).forEach( (item, index) => {
			let resizeName = item;
			if(/(\.)/.test(resizeName)){
				resizeName = item.replace(/(\.)/, "_resize500"+RegExp.$1);
			}
			rtvlist.push(statOrReizeFile(server_url+"/"+resizeName, url+"/"+item, item))
		})
		Promise.all(rtvlist).then( val => {
			resolve(val.map( item => {
				let { resizeSrc, originSrc } = item;
				return {
					resizeSrc,
					originSrc,
				}
			}))
		}).catch( val => {})
	})
}
async function geyPic(obj){
	let { start, limit, url, server_url, } = obj;
	var imglist = await readDir(url);
	console.log(start, imglist.length, " >>>>>>>>>>")
	if(start >= imglist.length){
		return {
			list: [],
			leng: imglist.length
		}
	}
	var result = await getresizePic(imglist, obj);
	return {
		list: result,
		leng: imglist.length
	};
}

process.on("message", msg => {
	let { start, limit = 5 } = msg;
	start = parseInt(start);
	limit = parseInt(limit)
	try{
		fs.statSync(server_url)
	}catch(e){
		fs.mkdirSync(server_url);
	}
	geyPic({ start, limit, server_url, url,}).then( val => {
		let { list, leng } = val;
		process.send({
			data: list.map( item => {
				console.log(server_url+"/"+item, "  ****************  ");
				let { resizeSrc, originSrc } = item;
				return {
					resizeSrc: path.relative(path.resolve(__dirname,"../../client/src"),resizeSrc),
					originSrc: path.relative(path.resolve(__dirname,"../../client/src"),originSrc),
				}
			}),
			total: leng
		})
	})
})
