var express = require("express");
var app = express();

app.use(express.static("../client"));
var server = app.listen("8080", () => {
  console.log(`fuck you`);
})
