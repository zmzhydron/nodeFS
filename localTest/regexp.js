'use strict'
var fs = require('fs');
var a = "zhangmingzhi"
var b = '@mz';
/(zhangming)/.test(a);
console.log(RegExp.$1);
console.log(b.replace(/(mz)/, RegExp.$1));

var aa = {
	name: "zmz"
}
var processfn = name => {
	return name+"fuckyou";
}