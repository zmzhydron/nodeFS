var request = require('request')
var fs = require("fs")
var path = require("path")
var iconv = require('iconv-lite')
var spa = require("superagent")

// spa.get("http://bbs.ngacn.cc")
// .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36")
// .end( (err, res) => {
// 	console.log(err, " ************* ")
// 	if(!err){
// 		var str = iconv.decode(res.text, "gbk")
// 		console.log(str);
//     fs.writeFile(path.resolve(__dirname,"./aa.json"), JSON.stringify(res, null, 2), (err) => {})
// 	}
// })

// var name = 'zhangmingzhi'
// var bf1 = Buffer.from(name);
// console.log(bf1);
// console.log(iconv.decode(bf1, "utf8")) 


// var url = "https://www.chiphell.com/thread-1772108-1-1.html";
var url = "https://www.zhihu.com/question/29926060";
var options = {
	encoding: null,
	url: url,
	gzip: true,
	// url: "http://bbs.ngacn.cc/read.php?tid=12076917&authorid=499550",
	headers: {
	  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
	  'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
	  'Accept-Encoding' : `gzip, deflate`,
	  'Accept-Language': `en-US,zh-CN;q=0.8,zh;q=0.6,en;q=0.4`,
	  // 'Cache-Control': 'no-cache',
	  // "Host": url,
	  // 'Pragma': `no-cache`,
	  // 'Proxy-Connection': `keep-alive`,
	  // 'Upgrade-Insecure-Requests': 1
	}
}
request(options, function (error, response, body) {
	// let str = iconv.decode(body, 'utf-8');
	let str = body;
	str = iconv.decode(body, "utf8")
	console.log(error, " *************** ");
  if (!error && response.statusCode == 200) {
    fs.writeFile(path.resolve(__dirname,"./aa.json"), body, (err) => {
    	if(!err){
  			console.log(str);
    	}
    })
  }
})