var request = require('request').defaults({jar: true})
// var request = require('request')
var fs = require("fs")
var path = require("path")
var iconv = require('iconv-lite')
var spa = require("superagent")
var cheerio = require("cheerio")
var cluster = require("cluster")
var os = require("os")
var util = require("util")
var events = require('events')
var eventEmitter = new events.EventEmitter()

const prechunk = 100; //最大并发下载数
const preart = 5; //最大文章读取数
const maxDrill = 5; //最大每个论坛往下查找5页


const interest = ["宝马M", "AMG", "法拉利论坛", "911", "阿斯顿", "奥迪RS", "兰博基尼", "宾利"];
const keyinterest = ["媳妇", "女友", "闺蜜", "性感", "黑丝", "肉丝"];
const ROOTURL = 'http://club.autohome.com.cn';

	var rootPath = path.resolve(__dirname,`./../../../autohome`)
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
	var domLog = path.resolve(rootPath, "./domLog.json");
	if(!fs.existsSync(domLog)){
		fs.writeFileSync(domLog,"")
	}
	var domLog1 = path.resolve(rootPath, "./domLog1.json");
	if(!fs.existsSync(domLog1)){
		fs.writeFileSync(domLog1,"")
	}
	var totoalSize = 0;
	//过滤名称中的非法字符串，避免创建失败
	function filterDist(str){
		if(!str){
			return false;
		}
		return str.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|\.|，|\.|\|\|)+/g,"");
	}
	//获取原来已经下载的，如果有，就不在请求，提升速度
	function getoldversion(){
		return fs.readFileSync(cfg).toString("utf8").split("@").filter( item => item.trim());
	}
	var oldList = getoldversion();
	var headers = {
			  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
			  'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
			  'Accept-Encoding': `gzip, deflate`,
			  'Accept-Language': `en-US,zh-CN;q=0.8,zh;q=0.6,en;q=0.4`,
				// "referer": "https://www.chiphell.com/",
			  // 'Cache-Control': 'no-cache',
			  // "Host": url,
			  // 'Pragma': `no-cache`,
			  // 'Proxy-Connection': `keep-alive`,
			  // 'Upgrade-Insecure-Requests': 1
			}
	//把一个数组拆分成小块数组
	function sliceToChunk(list, chunknum){
		var chunkList = [];
		var count = 0;
		var chunk = list.slice(count*chunknum, (count+1)*chunknum)
		while(chunk.length){
			chunkList.push(chunk)
			count++;
			chunk = list.slice(count*chunknum, (count+1)*chunknum)
		}
		return chunkList;
	}
	function dowmloadImage(imgchunks){
		function core(url, dist){
			return new Promise( (resolve, reject) => {
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
			})
		}
		function chunks(chunk){
			let chunkPromise = chunk.map( (item, index) => {
				let { src, disk } = item;
				return core(src, disk);
			})
			return Promise.all(chunkPromise)
		}
		async function go(imgchunks){
			let list = [];
			for(let s = 0; s<imgchunks.length; s++){
				let r = await chunks(imgchunks[s]);
				list = [...list, ...r]
			}
			return list;
		}
		return go(imgchunks)
	}
	function requestCore(url,callback = (...val) => val){
		var options = {
			encoding: null,
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
					if (!error && (response.statusCode == 200 || response.statusCode == 302)) {
						let str = iconv.decode(body,"gb2312")
						// fs.writeFileSync(domLog, util.inspect(str));
						resolve(callback(response, str, cheerio.load(str, { decodeEntities : false})));	
					}else{
						console.log('error: ', error, response.statusCode)
						resolve("0")
					}
				}
			})
		})
	}
	//get forms
	function getEveryForms(url){
		return new Promise( (resolve, reject) => {
			requestCore(url).then( val => {
				let [ response, body, $,] = val;
				var forms = Array.from($(".forum-list02 a"))
				.filter((item, index) => {
					let { attribs: attrs, parent, } = item;
					return interest.filter( asdf => item.attribs.title.includes(asdf)).length;
				})
				.map( item => {
					return {
						url: `http://club.autohome.com.cn${item.attribs.href}`,
						title: item.attribs.title
					}
				});
				forms = [...new Set(forms)]
				resolve(forms);
			})
		})
	}
 	//解析每个论坛的帖子，并创建这个论坛的文件夹
	function parseForms(obj){
		function single(item){
			//创建文件夹
			let { url, title } = item;
			let dir = path.resolve(rootPath, `./${title}`);
			if(!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}
			return new Promise( (resolve, reject) => {
				requestCore(url).then( val => {
					if(val == "0"){
						resolve([]);
						return 
					}
					let [ response, body, $,] = val;
					let topics = Array.from($(".a_topic"))
					.filter( (i,j) => {
						let lang = i.parent.parent.attribs.lang;
						if(lang){
							lang = lang.split("|");
							return lang[7] == "3" && lang[9] == "1";
						}else{
							return false;
						}
					})
					.map( (i,j) => {
						let topicName = filterDist(i.children[0].data.trim());
						if(!topicName){
							return false;
						}
						let topicSrc = ROOTURL+i.attribs.href;
						let donwloadSrc = path.resolve(dir,`./${topicName}`);
						if(!fs.existsSync(donwloadSrc)){
							fs.mkdirSync(donwloadSrc)
						}
						return {
							donwloadSrc,
							topicName,
							topicSrc
						}
					})
					resolve(topics);
				})	
			})
		}
		function chunk(chunk){
			return Promise.all(chunk.map( item => single(item)))
		}
		async function hehe(obj){
			let topics = [];
			for(let i = 0; i < obj.length; i++){
				let r = await chunk(obj[i]);
				let r_topics = r.reduce( (a,b) => {
					return [...a,...b]
				},[])
				topics = [...topics, ...r_topics];
			}
			return topics;
		}
		return hehe(obj);
	}
	//每个论坛往下查找
	function drill(forms,level){
		//每个论坛往下查找5页
		var allforms = [];
		forms.forEach( (item, index) => {
			let e = /-\d+\.html/;
			let { url, title, } = item;
			let count = 1;
			while(count < (level + 1)){
				url = url.replace(e, `-${count}.html`);
				count++;
				allforms.push({
					url,
					title,
				})
			}
		})
		return allforms;
	}
	//找到全部的img
	function processImage(topics){
		function core(item){
			let { donwloadSrc, topicSrc, topicName } = item;
			return new Promise( (resolve, reject) => {
				if(oldList.includes(topicName)){
					resolve([])
					console.log("已经有了主题:"+topicName, "跳过")
					return;
				}
				requestCore(topicSrc).then( val => {
					if(val == "0"){
						resolve([]);
						return 
					}

					let [ response, body, $,] = val;
					let imgs = Array.from($("img"))
					.filter( (item, index) => {
						let { attribs: { name = false, src9, src = "", } } = item;
						return src.includes("club2.autoimg.cn/album") ? true : (name === "lazypic" && src9);
					})
					.map( (item, index) => {
						let { attribs: { src9, src = "", } } = item;
						return {
							disk: `${donwloadSrc}/${index}.jpg`,
							src: src.includes("club2.autoimg.cn/album") ? src : src9
						}
					})
					fs.appendFileSync(cfg, `${topicName}@`);
					resolve(imgs)
				})
			})
		}
		function chunk(chunk){
			let chunkPromise = chunk.map( (item, index) => {
				return core(item);
			})
			return Promise.all(chunkPromise)
		}
		async function hehe(obj){
			let list = [];
			for(let i = 0; i < obj.length; i++){
				let r = await chunk(obj[i]);
				let r_list = r.reduce( (a,b) => {
					return [...a,...b]
				},[])
				list = [...list, ...r_list];
			}
			return list;
		}
		return hehe(topics);
	}
	async function crawl(){
		var start = new Date().valueOf();

		var forms = await getEveryForms(ROOTURL);
		var allforms = drill(forms,2);
		var topics = await parseForms(sliceToChunk(allforms, 2));
		topics = sliceToChunk(topics, 2);
		topics = [...topics.slice(0,40)]
		var imgs = await processImage(topics)
		console.log(imgs.length, " *************************  ")
		console.log('~~~~~~~~~~~~~~~~~~');
		var r = await dowmloadImage(sliceToChunk(imgs, 50))
		// var r = await request2(imglist);
		// console.log("爬虫用时: ", new Date().valueOf() - start);
		// return r;
		fs.appendFileSync(domLog, util.inspect(topics));
		return topics;
	}
	crawl().then( val => {
		let totoal = totoalSize / 1000 * 1000;
		// console.log(val)
		console.log(`*(************ok!!!!!*****************`, totoal, totoalSize)
	})
// }


				// request.get(`http://club2.autoimg.cn/album/g7/M00/F6/3E/userphotos/2017/07/05/12/500_wKjB0FlcakiAIKO4AAir2ZODQ8s742.jpg`)
				// .on('response', res => {
				// 	if(res.statusCode == 200){
				// 		console.log(`下载图片开始`)
				// 	}
				// })
				// .on('end', val => {
				// 	console.log(`完成`)
				// })
				// .on('error', val => {
				// 	console.log(`下载失败`, val);
				// })
				// .pipe(fs.createWriteStream('C:\\Users\\zmz\\Desktop\\Github\\autohome\\阿斯顿·马丁论坛\\『最爱还是自己的信仰』阿斯顿马丁VantageV8换车贴~/5.jpg'))