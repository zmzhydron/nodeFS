'use strict'
var fs = require("fs");
var test = `zhangmingzhi`;
var me = {
	name: "zhangmingzhi",
	age: 28,
	sex: "male",
	salary: 11000,
	target: 15000
}
var files = {
	test: function(){
		return me;
	},
	getFiles: src => {
		if(!src){
			return "path illege";
		}
		//判断是否是文件夹
		var isDir = fs.lstatSync(src).isDirectory();
		if(!isDir){
			return "NOT a Directory"
		}
		console.log(src,' currentRequest');
		//遍历整个文件夹;
		return fs.readdirSync(src).map( item => {
			let innerPath = `${src}/${item}`,
					r = fs.lstatSync(innerPath),
					type = "unknow",
					checkList = [
						{
							method: "isBlockDevice",
							iftrue: "isBlockDevice",
						},
						{
							method: "isCharacterDevice",
							iftrue: "isCharacterDevice",
						},
						{
							method: "isSymbolicLink",
							iftrue: "isSymbolicLink",
						},

						{
							method: "isFIFO",
							iftrue: "isFIFO",
						},
						{
							method: "isSocket",
							iftrue: "isSocket",
						},
						{
							method: "isFile",
							iftrue: "file",
						},
						{
							method: "isDirectory",
							iftrue: "dir",
						}
					];
			type = checkList.filter( item => r[item.method]())[0].iftrue
			return {
				name: item,
				lstatObj: r,
				path: innerPath,
				type,
				size: r.size
			}
		})
	},
	playMedia: src => {
		return fs.createReadStream(src);
	},
	readContent: src => {
		if(!src){
			return "path illege";
		}
		/*
			TODO 由于不知道文件大小，所以需要使用stream来读取，但是流是异步的，所以要考虑怎么写
		*/
		// var data =""
		// var fr = fs.createReadStream(src);
		// fr.on("data", function(chunk){
		// 	data += chunk.toString("utf8");
		// })
		// fr.on('end', function(){
		// 	console.log(data);
		// })
		return fs.readFileSync(src).toString("utf8")
				.trim()
				.split("\n")
				.map( item => {
					var ary = item.split("#");
					return {
						"palce": ary[0],
						"problem": ary[1],
						"cause": ary[2],
						"damege": ary[3],
						"damegelevel": ary[4],
						"resolve": ary[5]
					}
				})
	}
}
module.exports = files;