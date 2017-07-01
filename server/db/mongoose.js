var mongoose = require('mongoose');
var mongodb = require("mongodb");
var moserver = mongodb.Server;
var mongoclient = mongodb.MongoClient;

// mongoose.connect('mongodb://localhost/test');

var Schema = require("./schema.js");
var oneNameSchema = Schema.onename;
var carSchema = Schema.car;
var car_col = mongoose.model("Car", carSchema);
mongoose.connect('mongodb://zmz:zmz@127.0.0.1:27017/zmz');
// mongoose.connection.on("open", () => {
// 	console.log(" createConnection ")
// })
module.exports = {
	getCollections: (dbs, res) => {
		// mongoose.connect('mongodb://localhost/test');
		query = car_col.find({});
		// query.where("acceleration").lt(4)
		query.exec((err, results) => {
			if (err) {
				console.log(`query error`)
			} else {
				res.send(results);
			}
		})
	},
	queryMycar: (dbs, res) => {
		query = car_col.find();
		query.where("acceleration")
		// .lt(5)
		// .gte("torque",700)
		.and([{bhp: {$lt:600}},{torque: {$gte: 300}},{torque:{$lt:500}}])
		.where("driveType","fr")
		query.exec((err, results) => {
			if (err) {
				console.log(`query error`)
			} else {
				res.send(results);
			}
		})
	},
	addCollections: (dbs, res) => {
		res.send("empty request")
	},
	updateCar: (dbs, res, data) => {
		var updateSeq = {
			$set: {
				door: 2,
				driveType: 'fr',
				price: '44.5W'
			}
		}
		query = car_col.find({});
		query.where("acceleration").gt(5);
		query.exec((err, results) => {
			if (err) {
				console.log(`query error`)
			} else {
				results.forEach((item, index) => {
					item.update(updateSeq, (err, r) => {
						if (err) {
							console.log("cha zhao shibai", err)
						} else {
							res.send(r);
						}
					})
				})
			}
		})
	},
	deleteCar: (dbs, res, data) => {
		var id = data.body.id;
		var index = data.body.index;
		var q1 = car_col.remove();
		q1.where("_id", id);
		q1.exec((err, results) => {
			if (err) {
				res.send(err)
			} else {
				q2 = car_col.find();
				q2.exec((err, results) => {
					res.send(results)
				})

			}
		})
	},
	addCar: (dbs, res, data) => {
		var carName = data.body.carName;
		var fuelType = data.body.fuelType;
		var driveType = data.body.driveType;
		var bhp = data.body.bhp;
		var torque = data.body.torque;
		var gearbox = data.body.gearbox;
		var gearNumber = data.body.gearNumber;
		var acceleration = data.body.acceleration;
		var price = data.body.price;
		var door = data.body.door;
		var newcar = new car_col({
			carName: carName,
			fuelType: fuelType,
			driveType: driveType,
			bhp: bhp,
			torque: torque,
			gearbox: gearbox,
			price: price,
			gearNumber: gearNumber,
			acceleration: acceleration,
			door: door
		})
		newcar.save((err, results) => {
			if (err) {
				console.log(`chuangjian shibai`)
			} else {
				var q1 = car_col.find();
				q1.exec( (err, re) => {
					if(err){
						res.send("查询失败")
					}else{
						res.send(re);
					}
				})
			}
		})
	},
	exp: 1,
	query: 1,
	queryAndupdate: 1
}