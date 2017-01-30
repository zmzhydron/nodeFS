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
							iftrue: "文件",
						},
						{
							method: "isDirectory",
							iftrue: "文件架",
						}
					];
			type = checkList.filter( item => r[item.method]())[0].iftrue
			console.log(type, 'type');
			return {
				name: item,
				lstatObj: r,
				type,
				size: r.size
			}
		})
	}
}
module.exports = files;