var request = require('request').defaults({jar: true})
// var request = require('request')
var fs = require("fs")
var path = require("path")
var iconv = require('iconv-lite')
var spa = require("superagent")
var cheerio = require("cheerio")
var cluster = require("cluster")
var os = require("os")
var events = require('events')
var eventEmitter = new events.EventEmitter()

const prechunk = 100;

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

	var rootPath = path.resolve(__dirname,`./../../chh1`)
	if(!fs.existsSync(rootPath)){
		fs.mkdirSync(rootPath);
	}
	var cfg = path.resolve(rootPath, "./cfg.json");
	if(!fs.existsSync(cfg)){
		fs.writeFileSync(cfg,"");
	}
	var error2 = path.resolve(rootPath, "./errorcore.json");
	if(!fs.existsSync(error2)){
		fs.writeFileSync(error2,"");
	}
	var error1 = path.resolve(rootPath, "./errorimg.json");
	if(!fs.existsSync(error1)){
		fs.writeFileSync(error1,"");
	}
	var errorlog = path.resolve(rootPath, "./errorTITLE.json");
	if(!fs.existsSync(errorlog)){
		fs.writeFileSync(errorlog,"")
	}
	var totoalSize = 0;
	//过滤名称中的非法字符串，避免创建失败
	function filterDist(str){
		if(!str){
			return false;
		}
		return str.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|\.|，|\.)+/g,"");
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
		function requestCore(url,dist, resolve, reject, hashKey){
			request.get(url)
			.on('response', res => {
				if(res.statusCode == 200){
					totoalSize += parseInt(res.headers['content-length'])
					// console.log(`下载图片${url}开始`)
				}
			})
			.on('end', val => {
				// console.log(`${url}完成`)
				resolve("ok");
			})
			.on('error', val => {
				resolve("false")
				console.log(`下载${url}失败`, val);
				fs.appendFileSync(error1, `下载${url}失败;`);
			})
			.pipe(fs.createWriteStream(dist))
		}
		return new Promise( (resolve, reject) => {
			requestCore(url, dist, resolve, reject)
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
					console.log("rooterror: ",error)
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
				resolve(articles);
			})
		})
	}


	function makeImages(articles){
		let articlesPro = articles.map( (item, index) => {
			return new Promise((resolve, reject) => {
				let key = item.split(".com/")[1];
				if(oldList.includes(key)){
					console.log(`############ ${key} 已经存在, 快读！！！！`)
					resolve([])
				}else{
					requestCore(item).then( val => {
						if(val == "0"){
							console.log(" 。。。。。。。。。。。  ")
							resolve([])
						}else{
							let [ response, body, $,] = val;
							let title = filterDist($("#thread_subject").html());
							if(!title){
								resolve([])
								console.log("解析title失败!!!", item)
								fs.appendFileSync(errorlog, url+"@"+$("#thread_subject")+";")
								return;
							}
							//在window系统中如果路径含有特殊字符则会创建失败
							let dist = path.resolve(rootPath, `./${title}`);
							if(!fs.existsSync(dist)){
								fs.mkdirSync(dist)
								//获取单个文章中的全部主要图片；
								console.log(`开始下载 ${title}`)
						  	var chunk = Array.from($("img"))
						  	.filter( item => {
						  		let attrs = item.attribs;
						  		if(attrs.zoomfile && attrs.file){
						  			return attrs.file;
						  		}
						  	}).map( (item, index) => {
						  		return {
						  			url: `https://www.chiphell.com/${item.attribs.file}`,
						  			dist: `${dist}/${index}.jpg`
						  		}
						  	})
						  	resolve(chunk);
						  	fs.appendFileSync(cfg,`${key}:`)
						  	console.log(`***************** ${title} 解析完成, 写入cfg`)
							}else{
								fs.appendFileSync(cfg,`${key}:`)
								console.log(`----------------- ${title}已经存在, 写入cfg`)
								resolve([])
							}
						}
					})
				}
			})
		})
		return Promise.all(articlesPro)
	}

	function donwloadChunk(chunkimgs){
		let imgPromise = chunkimgs.map( (item, index) => {
			let { url, dist } = item;
			return dowmloadImage(url, dist)
		})
		return Promise.all(imgPromise)
	}
	//get all img infomations;
	function request2(imglist){
		var chunkList = [];
		var count = 0;
		var chunk = imglist.slice(count*prechunk, (count+1)*prechunk)
		while(chunk.length){
			chunkList.push(chunk)
			count++;
			chunk = imglist.slice(count*prechunk, (count+1)*prechunk)
		}
		return new Promise( (resolve, reject) => {
			async function core(chunkList){
				for(let i = 0; i<chunkList.length; i++){
					await donwloadChunk(chunkList[i])
				}
			}
			core(chunkList).then( val => {
				resolve("全部完成！！");
			})
		})
	}
	async function crawlCHH(){
		var start = new Date().valueOf();
		var articles = await request1(`https://www.chiphell.com`);
		articles = [...articles.slice(0,40)];
		var imgchunks = await makeImages(articles)
		console.log("~~~~~~~~~~~~~~~~~~")
		var imgs = imgchunks.reduce( (a,b) =>{ return [...a,...b] },[])
		console.log(imgs, " ~~~~~~~~~~~~~~~ ");
		var r = await request2(imgs);
		console.log("爬虫用时: ", new Date().valueOf() - start);
		return r;
	}
	crawlCHH().then( val => {
		let totoal = totoalSize / 1000 * 1000;
		console.log(`*(************${val}*****************`, totoal, totoalSize)
	})
// }