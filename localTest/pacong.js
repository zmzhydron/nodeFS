var request = require('request').defaults({jar: true})
// var request = require('request')
var fs = require("fs")
var path = require("path")
var iconv = require('iconv-lite')
var spa = require("superagent")
var cheerio = require("cheerio")
// var request = request.defaults({jar: true})
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

//过滤名称中的非法字符串，避免创建失败

function filterDist(str){
	if(!str){
		return "zz"+Math.random();
	}
	return str.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|)/g,"");
}

var rootPath = path.resolve(__dirname,`./../../chh`)
if(!fs.existsSync(rootPath)){
	fs.mkdirSync(rootPath);
}
var cfg = path.resolve(rootPath, "./cfg.json");
if(!fs.existsSync(cfg)){
	fs.writeFileSync(cfg,"");
}
//获取原来已经下载的，如果有，就不在请求，提升速度
console.log(fs.readFileSync(cfg), " ************ ")
function getoldversion(){
	return fs.readFileSync(cfg).toString("utf8").split(":").filter( item => item.trim());
}
var oldList = getoldversion();
var headers = {
		  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
		  'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
		  'Accept-Encoding': `gzip, deflate`,
		  'Accept-Language': `en-US,zh-CN;q=0.8,zh;q=0.6,en;q=0.4`,
			"referer": "https://www.chiphell.com/",
		  // 'Cache-Control': 'no-cache',
		  // "Host": url,
		  // 'Pragma': `no-cache`,
		  // 'Proxy-Connection': `keep-alive`,
		  // 'Upgrade-Insecure-Requests': 1
		}
function dowmloadImage(url, dist){
	return new Promise( (resolve, reject) => {
		// if(!fs.existsSync(dist)){
		// 	request.get(url)
		// 	.on('response', res => {
		// 		if(res.statusCode == 200){
		// 			console.log(`下载图片${url}开始`)
		// 		}
		// 	})
		// 	.on('end', val => {
		// 		console.log(`${url}完成`)
		// 		resolve("ok");
		// 	})
		// 	.pipe(fs.createWriteStream(dist))
		// }else{
		// 	resolve("ok");
		// }
		request.get(url)
		.on('response', res => {
			if(res.statusCode == 200){
				console.log(`下载图片${url}开始`)
			}
		})
		.on('end', val => {
			console.log(`${url}完成`)
			resolve("ok");
		})
		.pipe(fs.createWriteStream(dist))
	})
}
function requestCore(url,callback = (...val) => val){
	var options = {
		// encoding: null,
		url: url,
		gzip: true,
		// jar: j,
		headers: headers,
	}
	return new Promise( (resolve, reject) => {
		request(options, function (error, response, body) {
		  if (!error && response.statusCode == 200 || response.statusCode == 302) {
		  	// let str = iconv.decode(body,"utf8")
		  	resolve(callback(response, body, cheerio.load(body, {decodeEntities: false})));	
		  }
		})
	})
}
//get chiphell
function request1(url){
	return new Promise( (resolve, reject) => {
		requestCore(url).then( val => {
			let [ response, body, $,] = val;
			let one = false;
			var articles = Array.from($("a")).filter((item, index) => {
				let { attribs: attrs, parent, } = item;
				if(/^article-/.test(attrs.href) && parent.attribs.class === 'm'){
					return true;
				}
			}).map( item => {
				return `https://www.chiphell.com/${item.attribs.href}`;
			});
			resolve(articles = [...new Set(articles)]);
		})
	})
}

//get article infomations;
function request2(list){
	function donwloadSigle(url){
		return new Promise((resolve, reject) => {
			let key = url.split(".com/")[1];
			if(oldList.includes(key)){
				console.log(`${key} 已经存在, 快读！！！！`)
				resolve(`已经存在`)
			}else{
				requestCore(url).then( val => {
					let [ response, body, $,] = val;
					let title = filterDist($("#thread_subject").html());
					//在window系统中如果路径含有特殊字符则会创建失败
					let dist = path.resolve(rootPath, `./${title}`);
					if(!fs.existsSync(dist)){
						fs.mkdirSync(dist)
						//获取单个文章中的全部主要图片；
						console.log(`开始下载 ${title}`)
				  	var imgs = Array.from($("img")).filter( item => {
				  		let attrs = item.attribs;
				  		if(attrs.zoomfile && attrs.file){
				  			return attrs.file;
				  		}
				  	}).map( (item,index) => {
				  		return dowmloadImage(`https://www.chiphell.com/${item.attribs.file}`,`${dist}/${index}.jpg`)
				  	})
				  	//单个文章图片全部完成时候输入log
				  	Promise.all(imgs).then( val => {
				  		console.log(`${title} 图片全部下载完成, 写入cfg`)
				  		fs.appendFileSync(cfg,`${key}:`)
				  		resolve("ok2")
				  	})
					}else{
						fs.appendFileSync(cfg,`${key}:`)
						console.log(`${title}已经存在, 写入cfg`)
						resolve(`${title}已经存在`)
					}
				})
			}

		}) 
	}
	return new Promise( (resolve, reject) => {
		async function core(list){
			for(let i = 0; i<list.length; i++){
				await donwloadSigle(list[i])
			}
		}
		core(list).then( val => {
			resolve("全部完成！！");
		})
	})
}
async function crawlCHH(){
	var start = new Date().valueOf();
	var articles = await request1(`https://www.chiphell.com`);
	// articles = [...articles.slice(0,10)];
	var r = await request2(articles);
	console.log("爬虫用时: ", new Date().valueOf() - start);
	return r;
}
crawlCHH().then( val => {
	console.log(`*(************${val}*****************`)
})

// fs.appendFileSync(cfg, "hehe:");
// fs.appendFileSync(cfg, "haha:");
// fs.appendFileSync(cfg, "1:");
// fs.appendFileSync(cfg, "2:");
// fs.mkdirSync("C:\Users\zmz\Desktop\Github\chh\开箱对比简测全球首款光学防抖运动相机-索尼FDR-X3000R")
// var strs = `&#x51A4;&#x5927;&#x5934;-Lego42009&#x666E;&#x7248; - &#x6A21;&#x578B;&#x624B;&#x529E; -  Chiphell - &#x5206;&#x4EAB;&#x4E0E;&#x4EA4;&#x6D41;&#x7528;&#x6237;&#x4F53;&#x9A8C;`
// // console.log(unescape)
// var rr = unescape("&#x51A4".replace(/\\/g, "%"))
// console.log(rr)
var url = "https://www.chiphell.com/thread-1772108-1-1.html";
// var url = "https://www.zhihu.com/question/29926060";
// var url = "http://bbs.ngacn.cc/read.php?tid=12076917&rand=613";


// request(options, function (error, response, body) {
// 	// let str = iconv.decode(body, 'utf-8');
// 	let str = body;
// 	// str = iconv.decode(body, "utf8")
// 	console.log(error, " *************** ");
//   if (!error && response.statusCode == 200) {
//   	$ = cheerio.load(str);

//   	var imgs = Array.from($("img")).filter( item => {
//   		let attrs = item.attribs;
//   		if(attrs.zoomfile && attrs.file){
//   			return attrs.file;
//   		}
//   	}).map( (item,index) => {
//   		let imgurl = `https://www.chiphell.com/${item.attribs.file}`;
//   		request.get(imgurl)
//   		.on('response', res => {
//   			if(res.statusCode == 200){
//   				console.log(`下载图片${imgurl}开始`)
//   			}
//   		})
//   		.pipe(fs.createWriteStream(path.resolve(__dirname,`./../../chh/${index}.jpg`)))
//   		return item.attribs.file;
//   	}).join("\n")
//     fs.writeFile(path.resolve(__dirname,"./../aa.json"), imgs, (err) => {
//     	if(err){
//     		console.log(err)
//     	}else{
//     		console.log("ok!!")
//     	}
//     })
//   }
// })