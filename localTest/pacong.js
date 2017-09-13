var request = require('request').defaults({jar: true})
// var request = require('request')
var fs = require("fs")
var path = require("path")
var iconv = require('iconv-lite')
var spa = require("superagent")
var cheerio = require("cheerio")
var cluster = require("cluster")
var os = require("os")
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

const prechunk = 5;
let maxLinks = 200;
let links = 0;

// if(cluster.isMaster){
// 	os.cpus().forEach( (item, index) => {
// 		cluster.fork()
// 	})
// 	cluster.on("listening", (worker, address) => {
// 		console.log('listening: worker ' + worker.process.pid +', port: '+address.port);
// 	})
// 	cluster.on("exit", (worker, code, signal) => {
// 		setTimeout( () => {
// 			console.log(`worker : ${worker.process.id} 重启`)
// 			worker.fork();
// 		},1000);
// 	})
// }else{
	if(!fs.existsSync("./errorlog.json")){
		fs.writeFileSync('./errorlog.json',"")
	}
	var rootPath = path.resolve(__dirname,`./../../chh`)
	if(!fs.existsSync(rootPath)){
		fs.mkdirSync(rootPath);
	}
	var cfg = path.resolve(rootPath, "./cfg.json");
	if(!fs.existsSync(cfg)){
		fs.writeFileSync(cfg,"");
	}
	var error2 = path.resolve(rootPath, "./error2.json");
	if(!fs.existsSync(error2)){
		fs.writeFileSync(error2,"");
	}
	var error1 = path.resolve(rootPath, "./error1.json");
	if(!fs.existsSync(error1)){
		fs.writeFileSync(error1,"");
	}
	var totoalSize = 0;
	//过滤名称中的非法字符串，避免创建失败
	function filterDist(str){
		if(!str){
			return false;
		}
		return str.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|)/g,"");
	}


	//获取原来已经下载的，如果有，就不在请求，提升速度

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
		var errorCount = 0;
		function core(url,dist, resolve, reject){
			if(errorCount > 2){
				console.log(`请求url${url}错误超过2次，退出`)
				resolve("false,")
				return false;
			}
			request.get(url)
			.on('response', res => {
				if(res.statusCode == 200){
					totoalSize += parseInt(res.headers['content-length'])
					// console.log(`下载图片${url}开始`)
				}
			})
			.on('end', val => {
				// console.log(`${url}完成`)
				errorCount = 0;
				resolve("ok");
			})
			.on('error', val => {
				console.log(`下载${url}失败`)
				fs.appendFileSync(error, `${val}@${url};`)
				errorCount++;
				core(url, dist, resolve, reject)
			})
			.pipe(fs.createWriteStream(dist))
		}
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
			core(url, dist, resolve, reject)
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
				if(!response){
					console.log(error)
					fs.appendFileSync(error2, error+"@"+url+";")
					resolve("0")
				}else{
					if (!error && response.statusCode == 200 || response.statusCode == 302) {
						// let str = iconv.decode(body,"utf8")
						resolve(callback(response, body, cheerio.load(body, {decodeEntities: false})));	
					}
				}

			})
		})
	}
	//get chiphell
	function request1(url){
		return new Promise( (resolve, reject) => {
			requestCore(url).then( val => {

				let [ response, body, $,] = val;
				var articles = Array.from($("a"))
				.filter((item, index) => {
					let { attribs: attrs, parent, } = item;
					if(/^article-/.test(attrs.href) && parent.attribs.class === 'm'){
						return true;
					}
				})
				.map( item => `https://www.chiphell.com/${item.attribs.href}`);
				articles = [...new Set(articles)]
				var lists = [];
				var count = 0;
				var chunk = articles.slice(count*prechunk, (count+1)*prechunk)
				while(chunk.length){
					lists.push(chunk)
					count++;
					chunk = articles.slice(count*prechunk, (count+1)*prechunk)
				}
				resolve(lists);
			})
		})
	}

	//get article infomations;
	function request2(list){
		function donwloadChunk(chunk){
			function single(url){
				return new Promise((resolve, reject) => {
					let key = url.split(".com/")[1];
					if(oldList.includes(key)){
						console.log(`${key} 已经存在, 快读！！！！`)
						resolve(`已经存在`)
					}else{
						requestCore(url).then( val => {
							if(val == "0"){
								resolve("0")
								return
							}
							let [ response, body, $,] = val;
							let title = filterDist($("#thread_subject").html());
							if(!title){
								resolve(`${url} 读取 title失败`)
								fs.appendFileSync("./errorlog.json", url+"@"+$("#thread_subject")+";")
								return;
							}
							//在window系统中如果路径含有特殊字符则会创建失败
							let dist = path.resolve(rootPath, `./${title}`);
							if(!fs.existsSync(dist)){
								fs.mkdirSync(dist)
								//获取单个文章中的全部主要图片；
								console.log(`开始下载 ${title}`)
						  	var imgs = Array.from($("img"))
						  	.filter( item => {
						  		let attrs = item.attribs;
						  		if(attrs.zoomfile && attrs.file){
						  			return attrs.file;
						  		}
						  	})
						  	.map( (item,index) => {
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
			let chunkPromise = chunk.map( item => {
				return single(item);
			});
			return Promise.all(chunkPromise);
		}
		return new Promise( (resolve, reject) => {

			async function core(list){
				for(let i = 0; i<list.length; i++){
					await donwloadChunk(list[i])
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
		let totoal = totoalSize / 1000 * 1000;
		console.log(`*(************${val}*****************`, totoal, totoalSize)
	})



		// var errc = 0;
		// function aaa(){
		// 	if(errc > 4){
		// 		console.log("尝试次数超过限制，退出")
		// 		return false;
		// 	}
		// 	request.get(`https://www.chiph1ell.com/data/attachment/forum/201705/01/14.jpg`)
		// 	.on('response', res => {
		// 		console.log(res.headers['content-length'])
		// 		if(res.statusCode == 200){
		// 			console.log(`下载图片开始`)
		// 		}
		// 	})
		// 	.on('end', val => {
		// 		console.log(`完成`)
		// 		// resolve("ok");
		// 	})
		// 	.on('error', val => {
		// 		errc++;
		// 		console.log(`下载失败`)
		// 		console.log(val)
		// 		aaa();
		// 	})
		// 	.pipe(fs.createWriteStream('./../../1.jpg'))
		// }
		// aaa();
// }



