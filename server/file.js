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
	}
}

var a = "${zhangmingzhi} fuckyou ${zmz}"
var e = /\${(.+?)}/g;
var aa = 'zhangmingzhi 43 .fuckyou zmz';
var ee = /43 \.fuckyou/;
var e1 = new RegExp("(43 .fuckyou){2,}","g");
var a1 = 'zhangmingzhiishit';
console.log(e1.test(aa));
console.log(RegExp.$1, "$1")
// console.log(a.match(e));
// console.log(aa.split("43 .fuckyou"));
console.log(RegExp("(43 .fuckyou){2,}","g"));
// module.exports = files;