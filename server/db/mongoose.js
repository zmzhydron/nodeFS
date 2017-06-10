var mongoose = require('mongoose');
var mongodb = require("mongodb");
var moserver = mongodb.Server;
var mongoclient = mongodb.MongoClient;

// mongoose.connect('mongodb://localhost/test');

var Schema = require("./schema.js");
var oneNameSchema = Schema.onename;
var oneName = mongoose.model("oneName", oneNameSchema, "zmz");


mongoose.connect('mongodb://zmz:zmz@127.0.0.1:27017/zmz');
// mongoose.connection.on("open", () => {
// 	console.log(" createConnection ")
// })
var query = oneName.find({});
module.exports = {
	getCollections: (dbs, res) => {
		// mongoose.connect('mongodb://localhost/test');
		query = oneName.find({});
		// query.where('uuid').gt(1)
		query.exec( (err, results) => {
			if(err){
				console.log(`query error`)
			}else{
				res.send(results);
			}
		})

	},
	addCollections: (dbs, res) => {
		// mongoose.connect('mongodb://localhost/test');
		var newname = new oneName({
			name: "sjb",
			age: 29
		})
		newname.save( (err, results) => {
			if(err){
				console.log(`chuangjian shibai`)
			}else{
				console.log(`chuangjian chenggong`)
				res.send(results);
			}
		})
	},
	exp: 1,
	query:1,
	queryAndupdate: 1
}
