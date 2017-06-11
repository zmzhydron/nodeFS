var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = {
	onename: new Schema({
		name: String,
		age: Number
	}),
	car: new Schema({
		carName: String,
		fuelType: String,
		driveType: String,
		bhp: String,
		torque: String,
		gearbox: String,
		gearNumber: String,
		acceleration: String,
		door: String,
	})
}