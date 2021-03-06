var request = require('request').defaults({ jar: true })
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

function removeDir(dir) {
	let files = fs.readdirSync(dir);
	files.forEach((item, index) => {
		let src = path.resolve(dir, item);
		if (fs.statSync(src).isDirectory()) {
			removeDir(src)
		} else {
			fs.unlinkSync(src)
		}
	})
	fs.rmdirSync(dir);
}

const interest = ["宝马M", "AMG", "奥迪Q7", "宝马X5", "法拉利论坛", "911", "Cayman", "S级论坛", "7系", "6系", "阿斯顿", "奥迪RS", "兰博基尼", "宾利"];
const keyinterest = ["媳妇", "女友", "闺蜜", "性感", "黑丝", "肉丝"];
const ROOTURL = 'http://club.autohome.com.cn';
let errorImageList = []; //下载失败的img
let shibaitopic = [];  //下载失败的帖子

function pa(o, next) {
	const io = function (msg, name = "windowa") {
		if (o.io) {
			o.io.emit('progress', {
				type: name,
				msg,
			})
		} else {
			throw Error("io接口为空");
		}
	}
	//遍历chunk方法
	const processChunk = (chunk, cb) => {
		return Promise.all(chunk.map(cb));
	}
	var rootPath = path.resolve(__dirname, `./../../../autohome`)
	if (!fs.existsSync(rootPath)) {
		fs.mkdirSync(rootPath);
	}
	// var cfg = path.resolve(rootPath, "./cfg.json");
	// if (!fs.existsSync(cfg)) {
	// 	fs.writeFileSync(cfg, "");
	// }
	// var error2 = path.resolve(rootPath, "./errorcore.json");
	// if (!fs.existsSync(error2)) {
	// 	fs.writeFileSync(error2, "");
	// }
	// var errorimg = path.resolve(rootPath, "./errorimg.json");
	// if (!fs.existsSync(errorimg)) {
	// 	fs.writeFileSync(errorimg, "");
	// }
	// var errorlog = path.resolve(rootPath, "./errorTITLE.json");
	// if (!fs.existsSync(errorlog)) {
	// 	fs.writeFileSync(errorlog, "")
	// }
	// var domLog = path.resolve(rootPath, "./domLog.json");
	// if (!fs.existsSync(domLog)) {
	// 	fs.writeFileSync(domLog, "")
	// }
	// var domLog1 = path.resolve(rootPath, "./domLog1.json");
	// if (!fs.existsSync(domLog1)) {
	// 	fs.writeFileSync(domLog1, "")
	// }
	var totoalSize = 0;
	//过滤名称中的非法字符串，避免创建失败
	function filterDist(str) {
		if (!str) {
			return false;
		}
		return str.replace(/(\\|\/|\:|\*|\?|\"|\<|\>|\|\.|，|\.|\|\|)+/g, "");
	}
	//获取原来已经下载的，如果有，就不在请求，提升速度
	// function getoldversion() {
	// 	return fs.readFileSync(cfg).toString("utf8").split("@").filter(item => item.trim());
	// }
	// var oldList = getoldversion();
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
	function sliceToChunk(list, chunknum) {
		var chunkList = [];
		var count = 0;
		var chunk = list.slice(count * chunknum, (count + 1) * chunknum)
		while (chunk.length) {
			chunkList.push(chunk)
			count++;
			chunk = list.slice(count * chunknum, (count + 1) * chunknum)
		}
		return chunkList;
	}
	function dowmloadImage(imgchunks, type) {
		function core(_obj_) {
			let { src: url, dist } = _obj_;
			return new Promise((resolve, reject) => {
				if(type){
					console.log(` ............${url}............`);					
				}
				request.get(url)
					.on('response', res => {
						if (res.statusCode == 200) {
							totoalSize += parseInt(res.headers['content-length']);
							if(type){
								console.log(` #########${url}######### `);
							}
						}
					})
					.on('end', val => {
						io(`${url}完成`, "windowe");
						resolve("ok");
					})
					.on('error', val => {
						resolve("false")
						io(`下载${url}失败`, "windowc");
						errorImageList.push({ url, dist })
					})
					.pipe(fs.createWriteStream(dist))
			})
		}
		async function go(imgchunks) {
			let list = [];
			for (let s = 0; s < imgchunks.length; s++) {
				
				let r = await processChunk(imgchunks[s], core);
				console.log(`chunk ${s} end <<<<<<<<<<<`)
				list = [...list, ...r]
			}
			return list;
		}
		return go(imgchunks);
	}
	function requestCore(url, callback = (...val) => val) {
		var options = {
			encoding: null,
			url: url,
			gzip: true,
			// jar: j,
			headers: headers,
		}
		return new Promise((resolve, reject) => {
			request(options, function (error, response, body) {
				if (!response) {
					console.log("rooterror: ", error, url)
					// fs.appendFileSync(error2, error + "@" + url + ";")
					resolve("0")
				} else {
					if (!error && (response.statusCode == 200 || response.statusCode == 302)) {
						let str = iconv.decode(body, "gb2312")
						// fs.writeFileSync(domLog, util.inspect(str));
						resolve(callback(response, str, cheerio.load(str, { decodeEntities: false })));
					} else {
						console.log('error: ', error, response.statusCode)
						resolve("0")
					}
				}
			})
		})
	}
	//获取论坛
	function getEveryForms(url) {
		return new Promise((resolve, reject) => {
			requestCore(url).then(val => {
				let [response, body, $,] = val;
				var forms = Array.from($(".forum-list02 a"))
					.filter((item, index) => {
						let { attribs: attrs, parent, } = item;
						return interest.filter(asdf => item.attribs.title.includes(asdf)).length;
					})
					.map(item => {
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
	function parseForms(obj) {
		function single(item) {
			//创建文件夹
			let { url, title } = item;
			let dir = path.resolve(rootPath, `./${title}`);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			return new Promise((resolve, reject) => {
				requestCore(url).then(val => {
					if (val == "0") {
						resolve([]);
						io(`${title} ${url} 解析论坛大类失败！`, "windowc")
						return;
					}
					let [response, body, $,] = val;
					let topics = Array.from($(".a_topic"))
						.filter((i, j) => {
							let lang = i.parent.parent.attribs.lang;
							if (lang) {
								lang = lang.split("|");
								return lang[7] == "3" && lang[9] == "1";
							} else {
								return false;
							}
						})
						.map((i, j) => {
							let topicName = filterDist(i.children[0].data.trim());
							if (!topicName) {
								io(`${topicName} 在DOM中查找失败！`, "windowc")
								return false;
							}
							let topicSrc = ROOTURL + i.attribs.href;
							let donwloadSrc = path.resolve(dir, `./${topicName}`);
							if (!fs.existsSync(donwloadSrc)) {
								fs.mkdirSync(donwloadSrc)
								io(`${topicName} 已经完成创建topic本地文件夹！`, "windowb")
								return {
									donwloadSrc,
									topicName,
									topicSrc,
								}
							} else {
								io("--已经有了主题: " + topicName + " 跳过", "windowd")
								return null;
							}
							// else {
							// 	return false
							// }
							// return {
							// 	donwloadSrc,
							// 	topicName,
							// 	topicSrc
							// }
						}).filter(item => item !== null);
					resolve(topics);
				})
			})
		}
		// function chunk(chunk) {
		// 	return Promise.all(chunk.map(item => single(item)))
		// }
		async function hehe(obj) {
			let topics = [];
			for (let i = 0; i < obj.length; i++) {
				let r = await processChunk(obj[i], single);
				let r_topics = r.reduce((a, b) => {
					return [...a, ...b]
				}, [])
				topics = [...topics, ...r_topics];
			}
			return topics;
		}
		return hehe(obj);
	}
	//每个论坛往下查找
	function drill(forms, level) {
		//每个论坛往下查找5页
		var allforms = [];
		forms.forEach((item, index) => {
			let e = /-\d+\.html/;
			let { url, title, } = item;
			let count = 1;
			while (count < (level + 1)) {
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
	//找到全部的img, type 为 reload的话，就是要删除原来的文件夹，并新建.
	function processImage(topics, type) {
		function core(item) {
			let { donwloadSrc, topicSrc, topicName, } = item;
			return new Promise((resolve, reject) => {
				// if (oldList.includes(topicName)) {
				// 	resolve([])
				// 	io("已经有了主题:" + topicName + "跳过", "windowd")
				// 	return;
				// }
				if (type === 'reload') {
					removeDir(donwloadSrc);
					fs.mkdirSync(donwloadSrc)
					io(`重新下载帖子${topicName}`, "windowr")
				}

				requestCore(topicSrc).then(val => {
					if (val == "0") {
						resolve([]);
						io(`解析${topicName}失败${topicSrc}`, "windowc")
						shibaitopic.push(item);
						return
					}

					let [response, body, $,] = val;
					let imgs = Array.from($("img"))
						.filter((item, index) => {
							let { attribs: { name = false, src9, src = "", } } = item;
							return src.includes("club2.autoimg.cn/album") ? true : (name === "lazypic" && src9);
						})
						.map((item, index) => {
							let { attribs: { src9, src = "", } } = item;
							return {
								dist: `${donwloadSrc}/${index}.jpg`,
								src: src.includes("club2.autoimg.cn/album") ? src : src9
							}
						})
					// fs.appendFileSync(cfg, `${topicName}@`);
					io(`解析${topicName}图片成功`, "windowa")
					resolve(imgs)
				})
			})
		}
		// function chunk(chunk) {
		// 	return Promise.all(chunk.map(item => core(item)))
		// }
		async function hehe(obj) {
			let list = [];
			for (let i = 0; i < obj.length; i++) {
				let r = await processChunk(obj[i], core);
				let r_list = r.reduce((a, b) => {
					return [...a, ...b]
				}, [])
				list = [...list, ...r_list];
			}
			return list;
		}
		return hehe(topics);
	}
	//faile safe 如果下载失败的话，那么就再次读取errorimg里的文件,并尝试重新下载;
	async function reloadimg() {
		if (errorImageList.length) {
			io("开始下载失败的图片", 'windowr');
			console.log(errorImageList);
			await dowmloadImage(sliceToChunk(errorImageList, 25), 'true');
			io("下载失败的完成", 'windowr');
		} else {
			io("没有下载失败的图片", 'windowr');
		}
		errorImageList = [];
	}
	async function realodtopic() {
		if (shibaitopic.length) {
			io(`开始失败尝试`, 'windowr');
			var imgs = await processImage(sliceToChunk(shibaitopic, 1), 'reload')
			var r = await dowmloadImage(sliceToChunk(imgs, 200), 'true');
			var reload = await reloadimg();
		} else {
			io("没有失败尝试", 'windowr');
		}
		shibaitopic = [];
	}
	async function crawl() {
		var start = new Date().valueOf();
		var forms = await getEveryForms(ROOTURL);
		var allforms = drill(forms, 3);
		var topics = await parseForms(sliceToChunk(allforms, 1));
		topics = sliceToChunk(topics, 2);
		// topics = [...topics.slice(0,5)]
		var imgs = await processImage(topics)
		console.log(imgs.length, " imgs.length  ")
		var r = await dowmloadImage(sliceToChunk(imgs, 250));
		console.log("爬虫用时: ", new Date().valueOf() - start);
		await reloadimg();
		console.log("bbbbbbbbbb")
		await realodtopic();
		console.log("ccccccccccc")
		return "ok";
	}
	return crawl()
}

module.exports = pa;