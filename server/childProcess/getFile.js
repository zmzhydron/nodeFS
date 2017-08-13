var fs = require("fs")
var path = require("path")
var gm = require('gm').subClass({imageMagick: true})
// const url = "C:/Users/zmz/Desktop/PIC/T"; //work
const url = "C:/Users/Administrator/Desktop/imgcopys"; // home
const server_url = path.resolve(__dirname,"../../client/photolist")
var startt;

function statOrReizeFile(resizeSrc, src, originSrc, filename){
	let key = filename.split(".")[0];
	//获取缩小后的图片
	var resizeInfo = {};
	startt = new Date().valueOf();
	var resizePro = new Promise( (resolve, reject) => {
		fs.stat(resizeSrc, (err, data) => {
			let status = 1;
			if(err){
				//创建resize 图片
				console.log(`getFile.js, fs.stat error!!!`)
				gm(src).resize(160,90).write(resizeSrc, (err, data) => {
					let msg = '', status = 1;
					if(err){
						status = 0;
						msg = "resize error";
					}
					resolve({
						status,
						msg,
						resizeSrc,
						originSrc,
						key,
					})
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
				console.log(`getFile.js, fs.stat sucess!!!`)
				resolve({
					status,
					resizeSrc,
					originSrc,
					key,
				})
			}
		})
	})
	//获取原始图片信息
	return Promise.all([resizePro]);
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
let infoData;
function getresizePic(list, obj){
	let { start, limit, url, server_url, } = obj;
	if(!infoData){
		infoData = fs.readFileSync(server_url+"/info.json");
		// console.log(JSON.parse(infoData));
		infoData = JSON.parse(infoData);
	}

	return new Promise( (resolve, reject) => {
		let rtvlist = [];
		list.slice(start, start + limit).forEach( (item, index) => {
			let resizeName = item;
			if(/(\.)/.test(resizeName)){
				resizeName = item.replace(/(\.)/, "_resize500"+RegExp.$1);
			}
			rtvlist.push(statOrReizeFile(server_url+"/"+resizeName, url+"/"+item, server_url+"/"+item, item))
		})
		Promise.all(rtvlist).then( val => {
			resolve(val.map( item => {
				// console.log("cost", new Date().valueOf() - startt);
				let { resizeSrc, originSrc, key } = item[0];
				return {
					resizeSrc,
					originSrc,
					infos: infoData[key]
				}
			}))
		}).catch( val => {})
	})
}
async function getPic(obj){
	let { start, limit, url, server_url, } = obj;
	var imglist = await readDir(url);
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
	getPic({ start, limit, server_url, url,}).then( val => {
		let { list, leng } = val;
		process.send({
			data: list.map( item => {
				let { resizeSrc, originSrc, infos, } = item;
				return {
					infos,
					resizeSrc: path.relative(path.resolve(__dirname,"../../client/src"),resizeSrc),
					originSrc: path.relative(path.resolve(__dirname,"../../client/src"),originSrc),
				}
			}),
			total: leng
		})
	})
})
