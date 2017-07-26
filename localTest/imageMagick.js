
var events = require('events');
var util = require("util");
var gm = require('gm').subClass({imageMagick: true});
var fs = require("fs")

var src1 = `C:/Users/zmz/Desktop/PIC/`;
var src2 = `D:/1481117013024.jpg`;
var dst1 = `C:/Users/zmz/Desktop/PIC/`


//genertorlize
function zoo(){
	let argus = [...arguments]
	let gen = argus[0];
	return new Promise( (resolve, reject) => {
		var g = gen(...argus.slice(1))
		function core(g, val){
			var r = g.next(val);
			console.log(r);
			if(r.done){
				resolve(r.value);
			}else{
				r.value.then( val => {
					core(g, val)
				}).catch( val => {
					reject(val)
				})
			}
		}
		core(g);
	})
}
function getGifnumber(src, gifname){
	return new Promise( (resolve, reject) => {
		gm(`${src}/${gifname}.gif`)
		.identify( (err, data) => {
			if(err){
				reject(" find gif error")
			}else{
				resolve(data.Format.length)
			}
		})
	})
}
function makeDir(src, gifname){
	return new Promise( (resolve, reject) => {
		try{
			fs.mkdirSync(`${src}/${gifname}`);
			resolve(`${src}/${gifname}`)
		}catch(e){
			resolve(`${src}/${gifname}`)
		}
	})
}
function getGifFrames(src, gifname, des, len){
	function getSinles(src, des, index){
		return new Promise( (resolve, reject) => {
			gm(src)
			.write(des, (err, data) => {
				if(err){
					reject(`read git @ ${index} error`)
				}else{
					resolve(`ok @ ${index}`)
				}
			})
		})
	}
	var prolist = [];
	for(let s =0;s<len;s++){
		prolist.push(getSinles(`${src}/${gifname}.gif[${s}]`,`${des}/${gifname}_${s}.png`, s))
	}
	return new Promise( (resolve, reject) => {
		Promise.all(prolist).then( val => {
			resolve("okay!")
		}).catch( val => {
			reject(`something when wrong`)
		})
	});
}
function *getGifPic(src, gifname, des){
	var len = yield getGifnumber(src, gifname);
	console.log(`totoal pic is ${len}`)
	var dirsrc = yield makeDir(des, gifname);
	var all = yield getGifFrames(src, gifname, dirsrc, len)
	return all;
}

zoo(getGifPic, src1, 'GG', dst1).then( val => {
	console.log(` convert gif success`)
}).catch( val => {
	console.log(` convert gif failed :${ val} `)
})