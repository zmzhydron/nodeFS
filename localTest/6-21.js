'use strict'
var path = require("path");

var joins = path.join(__dirname,"../client/src")
console.log(`join: ${joins}`)
var resolves = path.resolve(__dirname,"../client/src")
console.log(`resolve: ${resolves}`)
var relatives = path.relative(__dirname, resolves);
console.log(`relatives: ${relatives}`)