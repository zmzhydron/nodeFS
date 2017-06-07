//mongodb connect
var mongodb = require("mongodb");
var moserver = mongodb.Server;
var mongoclient = mongodb.MongoClient;

var isBackUpDbonline = false;
var backupDb = false;
function wrapper(cb){
	return function(_db,res,data){
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
					cb(db,res,data);
					backupDb = db;
					isBackUpDbonline = true;
				}
			});
			// res.send("数据库没有连接，立刻返回res");
		}else{
			cb(db,res,data);
		}
	}
}
module.exports = {
	getCollections: wrapper(function(db,res,data){
		db.collections(function(err, result){
			var r = result.map( function(item, index){
				return item.s.name
			})
			res.send(r);
		})
	}),
	addCollections: wrapper(function(db,res, data){
		var name = data.name,
				initCol = data.initCol;
		console.log(initCol, typeof initCol);
		db.createCollection(name, function(err, col){
			if(err){
				res.send("createCollnection faild")
			}else{
				col.insert(initCol, function(err, result){
					if(err){
						res.send("insert doc faild");
					}else{
						res.send("insert success")
					}
				})
			}
		})
	}),
	exp: wrapper(function(db,res,data){

	}),
	query: wrapper(function(db,res,data){
		var collname = data.collname;
		db.collection(collname, function(err, col){
			if(err){
				res.send("query collection error")
			}else{
				col.find(function(err, cur){
					if(err){
						res.send("find cursor faild");
					}else{
						var r = "";
						// cur.each(function(err, obj){
						// 	if(obj){
						// 		console.log(obj, typeof obj, obj.age);	
						// 		// r += JSON.stringify(obj, null, 2);
						// 		r =  r + obj.age;								
						// 	}else{
						// 		res.send(r);	
						// 	}
						// })
						function core(){
							cur.nextObject( function(err, obj) {
								if(obj){
									r += obj.age;
									core();
								}else{
									res.send(r)
								}
							})	
						}
						core();
					}
				})
			}
		});
	})
}

