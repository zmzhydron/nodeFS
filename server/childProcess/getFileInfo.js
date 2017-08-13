var fs = require("fs")
var path = require("path")
var gm = require('gm').subClass({imageMagick: true})
// const url = "C:/Users/zmz/Desktop/stuff/PIC/T"; //work
const url = "C:/Users/Administrator/Desktop/imgcopys"; // home
const server_url = path.resolve(__dirname,"../../client/photolist")

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
function getinfo(src){
	return new Promise( (resolve, reject) => {
		gm(`${url}/${src}`).identify( (err,data) => {
			if(err){
				resolve({})
			}else{
				let { size: { width, height, }, Filesize, Properties, } = data;
				let name = data.path.split("/").slice(-1)[0];
				let key = name.split(".")[0];
				//exif:DateTime, exif:Model 为Properties的属性，需要用Properties["exif:DateTime"]来获取
				//exif:DateTime为照片创建时间
				//exif:Model 为拍摄机型
				//Filesize 为照片大小
				//size 为尺寸
				resolve({
					dateTime: Properties["exif:DateTime"],
					model: Properties["exif:Model"],
					size: Filesize,
					width,
					height,
					name,
					key,
					origin: data,
				})
			}
		})
	})
}
function processCore(item){
	return new Promise( (resolve, reject) => {
		let key = item.split(".")[0];
		let resizeName = item;
		if(/(\.)/.test(resizeName)){
			resizeName = item.replace(/(\.)/, "_resize500"+RegExp.$1);
		}
		let resizeSrc = server_url+"/"+resizeName,
				src = url+"/"+item,
				originSrc = server_url+"/"+item;
		var resizePro = new Promise( (resolve, reject) => {
			fs.stat(resizeSrc, (err, data) => {
				let status = 1;
				if(err){
					//创建resize 图片
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
				}else{
					resolve({
						status,
						resizeSrc,
						originSrc,
						key,
					})
				}
			})
		})
		var getinfoPro = getinfo(item);
		var syncimg = new Promise( (resolve, reject) => {
			//创建图片引用;
			fs.symlink(src, server_url+"/"+item, (err, data) => {
				let status = 'failed'
				if(!err){
					status = `ok`
				}
				resolve(status);
			})
		})
		Promise.all([getinfoPro,resizePro,syncimg]).then( val => {
			resolve(val[0])
		});
	})
}
function processImgs(list){
	let chunk = 2;
	//拆分list为2个一个数组的二位数组;
	let subList = Array.from({
		length: parseInt(list.length / chunk) + (list.length % chunk > 0 ? 1 : 0)
	}).map( (item, index) => {
		let next = index+1; 
		return [...list.slice(index*chunk, next*chunk)]
	})
	function readSingleChunk(list, index){
		let innerList = list.map(processCore);
		return new Promise( (resolve, reject) => {
			Promise.all(innerList).then( val => {
				process.send({
					status: "1",
					msg: `chunk ${index} of ${subList.length} is finished`
				})
				resolve(val) 
			})
		})
	}
	async function readImageChunk(list){
		let r = [];
		for(let s = 0; s<list.length; s++){
			r.push(await readSingleChunk(list[s], s));
		}
		// console.log(r);
		return r.reduce( (a,b) => {
			return [...a,...b]
		},[]); 
	}
	return new Promise( (resolve, reject) => {
		readImageChunk(subList).then( val => {
			resolve(val);
		})
	})
}
function writetoFile(list){
	let data = {};
	list.forEach( item => {
		let { key } = item;
		data[key] = item;
	})
	data = JSON.stringify(data, null, 2);
	return new Promise( (resolve, reject) => {
		fs.writeFile(server_url+"/info.json", data, err => {
			if(!err){
				resolve('ok')
			}
		})
	})
}
process.on("message", data => {
	sortPhoto();
})
function sortPhoto(){
	try{
		fs.statSync(server_url);
	}catch(e){
		fs.mkdirSync(server_url);
	}
	getAllBitch(url).then( val => {
		process.send({
			status: '2', //表示全部完成,
			msg: 'all is done'
		}) 
	}).catch(val => {
		process.send({
			status: '0', //表示报错未完成
			msg: val.message ? val.message : val+""
		})
	})
}
async function getAllBitch(url){
	var r = "ok";
	try{
		fs.statSync(server_url+"/info.json");
	}catch(e){

	}
	var files = await readDir(url);
	var list = await processImgs(files);
	r = await writetoFile(list)
	return r;
}
