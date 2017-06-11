var mongoose = require('mongoose');
var mongodb = require("mongodb");
var moserver = mongodb.Server;
var mongoclient = mongodb.MongoClient;

// mongoose.connect('mongodb://localhost/test');

var Schema = require("./schema.js");
var oneNameSchema = Schema.onename;
var carSchema = Schema.car;
var oneName = mongoose.model("oneName", oneNameSchema, "zmz");
var carschemainstance;
carschemainstance = mongoose.model("carSchema", carSchema, "car");
mongoose.connect('mongodb://zmz:zmz@127.0.0.1:27017/zmz');
// mongoose.connection.on("open", () => {
// 	console.log(" createConnection ")
// })
var queryname = oneName.find({});
module.exports = {
	getCollections: (dbs, res) => {
		// mongoose.connect('mongodb://localhost/test');
		query = carschemainstance.find({});
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
	addCar: (dbs, res, data) => {
		console.log(data.body.price)
		var carName = data.body.carName;
		var fuelType = data.body.fuelType;
		var driveType = data.body.driveType;
		var bhp = data.body.bhp;
		var torque = data.body.torque;
		var gearbox = data.body.gearbox;
		var gearNumber = data.body.gearNumber;
		var acceleration = data.body.acceleration;
		var door = data.body.door;
		
		var newcar = new carschemainstance({
			carName: carName,
			fuelType: fuelType,
			driveType: driveType,
			bhp: bhp,
			torque: torque,
			gearbox: gearbox,
			gearNumber: gearNumber,
			acceleration: acceleration,
			door: door
		})
		newcar.save( (err, results) => {
			if(err){
				console.log(`chuangjian shibai`)
			}else{
				console.log(`chuangjian 111 chenggong`)
				res.send(results);
			}
		})
	},
	exp: 1,
	query:1,
	queryAndupdate: 1
}
