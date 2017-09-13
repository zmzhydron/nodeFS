var cluster = require("cluster")
var os = require("os")
var http = require("http")
var _worker = require("./worker.js")
var gm = require('gm').subClass({imageMagick: true})
const url = "C:/Users/Administrator/Desktop/imgcopys"; // home

// gm(`${url}/1481117013032.jpg`).autoOrient().write(`${url}/1481117013032OK.jpg`, (err, data) =>{
// 	if(!err){
// 		console.log("ok")
// 	}
// })

var lista = [1,2,3,4,5,6,7,8,9,10,11]
var count = 0;
// var max = Math.floor(lista.length / 3);
// max = lista.length % 3 > 0 ? (max + 1) : max;
// console.log(max);
// var listb = [];
// while(count <= max){
// 	listb = [...listb, [lista.slice(count*2, (count+1)*2)]]
// 	count++;
// }
// console.log(listb)
var listb = [];
var chunk = lista.slice(count*3, (count+1)*3);
var count = 0;
while(chunk.length){
	listb.push(chunk)
	count++;
	chunk = lista.slice(count*3, (count+1)*3)
}
console.log(listb)
// lista.forEach( (item, index) => {
// 	if(index % max){
// 		listb.push(chunk);
// 		chunk = [item];
// 	}else if({
// 		chunk.push(item)
// 	}
// })
// if(cluster.isMaster){
// 	let workers = [];
// 	for(let i = 0; i<os.cpus().length;i++){
// 		workers.push(cluster.fork());
// 	}
// 	// cluster.on("listening", (worker, address) => {
// 	// 	console.log('listening: worker ' + worker.process.pid +', Address: '+address.address+":"+address.port);
// 	// })

// 	workers.forEach( worker => {
// 		worker.send(`from master with love to you ${worker.id}`)
// 		worker.on("message", data => {
// 			console.log(` my worker : ${worker.id} give me a message : ${data}`)
// 		})
// 	})


// }else{
// 	http.createServer((req, res) => {
// 		res.writeHead(200, { 'Content-Type': 'text/plain' });
// 	  res.end('1111\n');
// 	}).listen(8000);
// }
// if(cluster.isWorker){
// 	process.on("message", data => {
// 		console.log(` from master : ${ data }`)
// 		process.send(` worker : ${cluster.worker.id} received`)
// 	})
// }