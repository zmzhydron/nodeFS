//mongodb connect
var mongodb = require("mongodb");
var moserver = mongodb.Server;
var mongoclient = mongodb.MongoClient;

var isBackUpDbonline = false;
var backupDb = false;

var pro_collection = function(db,collname){
	return new Promise( (resolve, reject) => {
		db.collection(collname, (err, collection) => {
			if(err){
				reject(`db.collection error`, err)
			}else{
				resolve(collection)	
			}
		})
	})
}
var pro_findWrap = type => (col, _paramObj ) => {
	var paramObj = _paramObj || {};
	console.log(_paramObj);
	var option = paramObj.option || false;
	var query = paramObj.query || false;
	var update = paramObj.update || false;
	return new Promise( (resolve, reject) => {
		var params = [query, update, option, (err, cur) => {
			if(err){
				reject(`db.collection error`, err)
			}else{
				resolve(cur)	
			}
		}].filter( item => item);
		col[type].apply(col, params);
	})
}
var pro_findall = pro_findWrap('find');
var pro_find = pro_findWrap("findOne");
var pro_update = pro_findWrap("update");

var wrapper = cb => (_db,res,data) => {
	var db = _db ? _db : (backupDb ? backupDb : false) ;
	if(!db){
		console.log("没有db对象");
		//如果没有，则先添加一个
		mongoclient.connect(`mongodb://zmz:zmz@127.0.0.1:27017/zmz`, function(err,db){
			if(err){
				console.log(" lianjie shibai !")
				console.log(err);
			}else{
				console.log(" linejie cheng gong!!")
				backupDb = db;
				isBackUpDbonline = true;
				return cb(db,res,data);
			}
		});
		// res.send("数据库没有连接，立刻返回res");
	}else{
		return cb(db,res,data);
	}
}
module.exports = {
	getCollections: wrapper( (db,res,data) => {
		db.collections( (err, result) => {
			var r = result.map( (item, index) =>{
				item.stats( (err, stats) => {
					if(err){
						console.log(`read stats error`)
					}else{
						console.log(stats);
					}
				})
				return item.s.name
			})
			res.send(r);
		})
	}),
	addCollections: wrapper((db,res, data) =>{
		var name = data.name,
				initCol = data.initCol;
		console.log(initCol, typeof initCol);
		db.createCollection(name, (err, col) =>{
			if(err){
				res.send("createCollnection faild")
			}else{
				col.insert(initCol, (err, result) =>{
					if(err){
						res.send("insert doc faild");
					}else{
						res.send("insert success")
					}
				})
			}
		})
	}),
	exp: wrapper( (db,res,data) =>{

	}),
	query: wrapper( (db,res,data) =>{
		var collname = data.collname;
		pro_collection(db,collname).then( value => {
			return pro_findall(value);
		}).catch(value => {
			console.log(`error : `,value);
		}).then( value => {
			var r = "start:";
			var o = "";
			function core(){
				value.nextObject( (err, obj) => {
					if(obj){
						r += obj.age +" # ";
						o += JSON.stringify(obj);
						console.log(JSON.stringify(obj));
						core();
					}else{
						res.send(`final is ${o}`);			
					}
				})	
			}
			core();
		})
	}),
	queryAndupdate: wrapper( (db,res,data) => {
		var collname = data.collname;
		pro_collection(db,collname).then( value => {
			return pro_update(value, {
				query: { colname: "张明之"},
				update: {
					$set: {
						colname: "张明之",
						updateTime: new Date().toString(),
						age: "29",
						uuid: Math.floor(Math.random() * 1000000)
					}
				},
				option:{
					upsert: false,
					multi: true,
					w: 1
				}
			})
		}).catch(value => {
			console.log(`error : `,value);
		}).then( value => {
			console.log(value, "  @@@@@@@@@@@@@")
			value.toArray( (err, item) => {
				console.log(item);
			}) 
		})
	})
}

