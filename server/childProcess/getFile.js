var fs = require("fs")
var path = require("path")
var gm = require('gm').subClass({imageMagick: true})

// const url = "C:/Users/zmz/Desktop/PIC/T"; //work
const url = "C:/Users/Administrator/Desktop/imgcopys"; // home
const server_url = path.resolve(__dirname,"../../client/photolist")

function getPicInfos(infos, callbacks = () => {}){
	return function(err, data){
		if(err){
			infos = {};
		}else{
			console.log(`identify`,data);
			let { size: { width, height, }, Filesize, Properties, } = data;
			//exif:DateTime, exif:Model 为Properties的属性，需要用Properties["exif:DateTime"]来获取
			//exif:DateTime为照片创建时间
			//exif:Model 为拍摄机型
			//Filesize 为照片大小
			//size 为尺寸
			// console.log(size, Properties["exif:DateTime"]);
			infos = {
				dateTime: Properties["exif:DateTime"],
				model: Properties["exif:Model"],
				size: Filesize,
				width,
				height,
				name: data.path.split("/").slice(-1)[0]
			}
		}
		callbacks(infos)
	}
}

function statOrReizeFile(resizeSrc, src, originSrc, filename){
	return new Promise( (resolve, reject) => {
		fs.stat(resizeSrc, (err, data) => {
			let status = 1;
			let infos = {};
			if(err){
				//创建resize 图片
				gm(src)
				.identify(getPicInfos(infos))
				.resize(160,90).write(resizeSrc, (err, data) => {
					let msg = '', status = 1;
					if(err){
						status = 0;
						msg = "resize error";
					}
					resolve({
						status,
						msg,
						resizeSrc,
						infos,
						originSrc,
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
				gm(src)
				.identify(getPicInfos(infos, (infos) => {
					resolve({
						infos,
						status,
						resizeSrc,
						originSrc,
					})
				}))
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
			rtvlist.push(statOrReizeFile(server_url+"/"+resizeName, url+"/"+item, server_url+"/"+item, item))
		})
		Promise.all(rtvlist).then( val => {
			resolve(val.map( item => {
				let { resizeSrc, originSrc, infos } = item;
				return {
					resizeSrc,
					originSrc,
					infos,
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
