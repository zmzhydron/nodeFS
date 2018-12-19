var path = require("path")
var fs = require("fs")
var childProcess = require("child_process")
var nodemailer = require("nodemailer")
var authomepacong = require("../../localtest/pacong/autohome.js")
var photoprocess;
var infoProcess;


/*
	KOA compose 组件，用于把多个middleware组合成一个middleware数组来使用
	E.G.
	const all = compose([ONE , TWO , THREE]);
	app.use(all);
	ONE TWO THREE 是3个无关的middleware，但是可以顺序执行;
*/
/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, function next () {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

let emailServer = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '373027385@qq.com',
        pass: 'hzqwlwoesoatbiid' //需要为授权码
    }
});

var tools = {
	compose: compose,
	lusting: (o, next) => {
		console.log(o)
		o.body = "fucking nice yeah!!!"
	},
	uploadCore: file => {
		return new Promise( (resolve, reject) => {
				fs.rename(file.path, file.destination+"\\"+file.originalname, err => {
					if(err){
						// reject("error bitch")
					}
					resolve({
						path: path.resolve(__dirname, `../../shitbird/${file.originalname}`),
						msg: `current path @ : ${path.join(__dirname, "../../shitbird")}`
					});
				})
			})
	},
	upload: function(){
		return async function upload(o,next){
			console.log(o.type, " ~~~~~~~~~~~~~~~ ")
			o.body = await tools.uploadCore(o.req.file);
			// o.set({"Content-Type": 'text/html'});
			o.set("Content-Type",'text/html');
		}
	},
	download: function(){
		return async function download(o,next){
			o.body = await new Promise( (resolve, reject) => {
				// var src = path.join(__dirname,"../../localtest/12-5.png");
				var src = "C:/Users/zmz/Desktop/stuff/aa.jpg";
				var rs = fs.createReadStream(src);
				console.log("~~~~~, ok ok")
				o.set({
					'Content-Type': 'application/octet-stream',
					'Content-Disposition': `attachment;filename=123.png`
				})
				resolve(rs);
			})
		}
	},
	getPhoto: function(){
		return async function getPhoto(o,next){
			if(!photoprocess){
				photoprocess = childProcess.fork(path.resolve(__dirname,'../childProcess/getFile.js'))
			}
			console.log("comps.js: "+photoprocess.pid)
			let { start, end } = o.request.body
			photoprocess.send({
				type: 'request',
				start,
				end,
			})
			var ioError = '@@';
			if(o.io){
				o.io.emit("soc", `@@@@@@@@@@@ ${o.io.id}`)
			}else{
				ioError = "$$$"
			}
			o.body = await new Promise( (resolve, reject) => {
				photoprocess.on("message", msg => {
					let { data: list = [], total = 0, morePhoto = 0 } = msg;
					resolve({
						list,
						total,
						ioError,
					})
				})	
			})
			// await next();
		}
	},
	initPhotos: function(){
		return async function(o,next){
			if(!infoProcess){
				infoProcess = childProcess.fork(path.resolve(__dirname,'../childProcess/getFileInfo.js'))
			}
			console.log(infoProcess.pid, "infoProcess.pid")
			infoProcess.send("gogo")
			o.body = await new Promise((resolve, reject) => {
				infoProcess.on("message", data => {
					let { status, msg } = data;
					data.socID = o.io.id;
					o.io.emit("heartbeat", JSON.stringify(data))
					if(status === "1"){

					}else if(status === '2'){
						resolve("initPhotos done")
					}else{

					}
				})
			})
		}
	},
	sendEmail: function(){
		return async function(o,next){
			let { title, content, to, } = o.request.body;
			let mailOptions = {
			    from: '"zhangmingzhi" <373027385@qq.com>', // sender address
			    attachments: [
			    	{
			    		filename: 'stream.txt',
			    		content : new Buffer("张明之buffers", 'utf-8')
			    	},
			    	{
			    		filename: 'upload.txt',
			    		path : "C:/Users/Administrator/Desktop/git/log.txt"
			    	},
			    	{
			    		filename: 'cidImage.jpg',
			    		path : "C:/Users/Administrator/Desktop/imgcopys/honda.jpg",
			    		cid: "honda"
			    	}
			    ],
			    to: 'zmzhydron@163.com', // list of receivers
			    subject: 'subject one', // Subject line
			    text: '~~~~~~~~~~~~~~', // plain text body
			    html: `<div class="box_06_2"> 
			    				<img src="cid:honda" />
								  <ul class="list13 ulAll ul02" id="ul01"> 
								    <li class="current"> 
								     <div class="m_picTxt02 clearfix m_picTxtOne"> 
								     <img src=""
								      <div class="m_txt02"> 
								       <h2><a href="http://pl.ifeng.com/a/20170816/51651709_0.shtml" target="_blank">北师大博士论文里的臭氧问题：没想象的那么荒诞</a></h2> 
								       <div class="tu1"> 
								        <a href="http://pl.ifeng.com/a/20170816/51651709_0.shtml" target="_blank" title=""><img src="http://d.ifengimg.com/w90_h90/p3.ifengimg.com/a/2017/0816/ecf9f1954916f87size41_w500_h298.jpg" width="90" height="90" title="北师大博士论文里的臭氧问题：没想象的那么荒诞" alt="北师大博士论文里的臭氧问题：没想象的" class="trans"></a> 
								       </div> 
								       <p>我们不能因为牛顿的信仰，而否认牛顿三大定律的正确性，同样，我们不能因为马克思主义“无所不能，无所不包”，<a href="http://pl.ifeng.com/a/20170816/51651709_0.shtml" target="_blank" title="">［详细]</a></p> 
								      </div> 
								     </div> 
								    </li> 
								  </ul> 
								</div>` // html body
			};
			o.body = await tools.emailCore(mailOptions);

		}
	},
	parseCookie: cookie => {
		let obj = {};
		if(!cookie){
			return obj;
		}
		cookie.split(";").forEach( item => {
			let pair = item.split("=");
			obj[pair[0].trim()] = pair[1].trim();
		})
		return obj;
	},
	setCookie: (obj = {}) => {
		return Object.keys(obj).map( item => {
			return `${item}=${obj[item]}`
		})
	},
	emailCore: mailOptions => {
		return new Promise( (resolve, reject) => {
			emailServer.sendMail(mailOptions, (error, info) => {
			    if (error) {
			        return console.log(error);
			        reject(" send email error!!!!")
			    }
			    resolve('send email success!!');
			});
		})
	},
	trax: () => async (o,next) => { //上传并发给我email
		var r = await tools.uploadCore(o.req.file);
		let mailOptions = {
		    from: '"zhangmingzhi" <373027385@qq.com>', // sender address
		    attachments: [
		    	{
		    		filename: 'stream.txt',
		    		content : new Buffer("张明之buffers", 'utf-8')
		    	},
		    	{
		    		filename: 'upload.txt',
		    		path : "C:/Users/Administrator/Desktop/git/log.txt"
		    	},
		    	{
		    		filename: 'cidImage.jpg',
		    		path : r.path,
		    		cid: "honda"
		    	}
		    ],
		    to: 'zmzhydron@163.com', // list of receivers
		    subject: 't-rax attack', // Subject line
		    text: '~~~~~~~~~~~~~~', // plain text body
		    html: `<div class="box_06_2"> 
		    				<img src="cid:honda" />
		    			</div>`
		    }
		o.body = await tools.emailCore(mailOptions);
	},
	//
	autohome: () => async (o,next) => {
		console.log('start')
		o.body = "狗狗狗狗";
		let r = await authomepacong(o,next);
		// o.body = r;
		console.log("完成咯，请慢用....");
		
	},
	socketOne: function(){
		// var io = require('socket.io')(server)
	},

}

module.exports = tools;
