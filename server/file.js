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
module.exports = files;