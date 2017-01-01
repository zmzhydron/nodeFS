var webpack = require("webpack");
var peizhi = require("./peizhi");
console.log(peizhi)
webpack(peizhi, function(){
	console.log("packing")
});