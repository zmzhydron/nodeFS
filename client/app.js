var $ = require("jquery")
$("body").append("<p>fuck you shit</p>")
var me = [1,2,3,4,5]
var zmz = 'SHABIA';
var newlist = [...me,'fuck you to11',...zmz.split("")];
console.log(newlist);

setTimeout( function(){
	$.ajax({
		url: "/api/fuckyou",
		success: function(res){
			console.log(res);
		}
	})
	$.ajax({
		url: "/api/suckyou",
		success: function(res){
			console.log(res);
		}
	})
},1000);