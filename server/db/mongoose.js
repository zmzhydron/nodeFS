var mongoose = require('mongoose');
var mongodb = require("mongodb");
var moserver = mongodb.Server;
var mongoclient = mongodb.MongoClient;
var Schema = require("./schema.js");
var koatools = require("../koa-components/koa-tools.js")


var car_col = mongoose.model("Car", Schema.car);
var car2 = ""

mongoose.connect('mongodb://zmz:zmz@127.0.0.1:27017/zmz');


let Query = model => {
	return new Promise( (resolve, reject) => {
		model.exec((err, results) => {
			if (err) {
				reject(koatools.err(err));
			} else {
				resolve(koatools.success(results));
			}
		})
	})
}
let Deletes = model => {
	return new Promise( (resolve, reject) => {
		model.exec((err, results) => {
			if (err) {
				reject(koatools.err(err));
			} else {
				resolve(results);
			}
		})
	})
}
let Insert = model => {
	return new Promise( (resolve, reject) => {
		model.save((err, results) => {
			if (err) {
				reject(err)
			} else {
				resolve(1);
			}
		})
	})
}

module.exports = {
	querys: () => {
		// let r 
		return async function getAllCars(o,next){
			o.body = await Query(car_col.find());
			// await next();
		}
	},
	queryMycar: () => {
		return async (o, next) => {
			let query = car_col.find();
			query.where("acceleration")
			.lt(5)
			.gte("torque",700);
			// .and([{bhp: {$lt:600}},{torque: {$gte: 300}},{torque:{$lt:500}}])
			// .where("driveType","fr")
			o.body = await Query(query);
			// await next();
		}
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
	deleteCar: () => {
		return async (o,next) => {
			var q1 = car_col.remove();
			q1.where("_id", o.request.body.id);
			let r = await Deletes(q1);
			console.log(r, " ~~~~~~~~~~~~~~~~~~~ ");
			
			if(r){
				o.body = await Query(car_col.find())
			}else{
				await next();	
			}
		}
	},
	addCar: () => {
		return async function addCar(o,next){
			console.log(o.request.body);
			var body = o.request.body;
			var carName = body.carName;
			var fuelType = body.fuelType;
			var driveType = body.driveType;
			var bhp = body.bhp;
			var torque = body.torque;
			var gearbox = body.gearbox;
			var gearNumber = body.gearNumber;
			var acceleration = body.acceleration;
			var price = body.price;
			var door = body.door;
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
			var isInsertOk = await Insert(newcar);
			if(isInsertOk){
				o.body = await Query(car_col)();
				console.log("22222222222")
			}else{
				o.body = isInsertOk;
			}
			console.log("111111111111")
		}	

	},
	exp: 1,
	query: 1,
	queryAndupdate: 1
}