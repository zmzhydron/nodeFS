var fs = require("fs")
var path = require("path")
var gm = require('gm').subClass({imageMagick: true})
const url = "C:/Users/zmz/Desktop/PIC/T"; //work
// const url = "C:/Users/Administrator/Desktop/imgcopys"; // home
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
function getAllInfos(list){
	let listPros = list.map( item => {
		return new Promise( (resolve, reject) => {
			gm(`${url}/${item}`).identify( (err,data) => {
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
	})
	return Promise.all(listPros).then( val => {
		return val.map( item => {
			console.log(item)
			return item;
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
	try{
		fs.statSync(server_url);
	}catch(e){
		fs.mkdirSync(server_url);
	}
	getAllBitch(url).then( val => {
		console.log(val, " ********************  ")
		process.send(val) 
	})
})
async function getAllBitch(url){
	var r = "ok";
	try{
		fs.statSync(server_url+"/info.json");
	}catch(e){

		var files = await readDir(url);
		var list = await getAllInfos(files);
		r = await writetoFile(list)
	}
	return r;
}
