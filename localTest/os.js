hahahaha1111//http://nodejs.cn/api/os.html
var os = require("os")
var fs = require("fs")
hehe
// console.log(os.arch())
// console.log(os.cpus()) //os.cpus() 方法返回一个对象数组, 包含安装的每个CPU/CPU核的信息.
console.log(os.homedir(), "homedir") //os.homedir() 方法以字符串的形式返回当前用户的home目录.
let cpus = JSON.stringify(os.cpus(),null,2);
fs.writeFile('C:/Users/zmz/Desktop/cpus.txt', cpus, (err) => {
	console.log("ok")
})
