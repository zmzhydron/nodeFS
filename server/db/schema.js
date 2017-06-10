var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = {
	onename: new Schema({
		name: String,
		age: Number
	})
}