var cluster = require("cluster")
var os = require("os")
var http = require("http")
var _worker = require("./worker.js")

if(cluster.isMaster){
	let workers = [];
	for(let i = 0; i<os.cpus().length;i++){
		workers.push(cluster.fork());
	}
	// cluster.on("listening", (worker, address) => {
	// 	console.log('listening: worker ' + worker.process.pid +', Address: '+address.address+":"+address.port);
	// })

	workers.forEach( worker => {
		worker.send(`from master with love to you ${worker.id}`)
		worker.on("message", data => {
			console.log(` my worker : ${worker.id} give me a message : ${data}`)
		})
	})
}else{
	http.createServer((req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
	  res.end('1111\n');
	}).listen(8000);
}
if(cluster.isWorker){
	process.on("message", data => {
		console.log(` from master : ${ data }`)
		process.send(` worker : ${cluster.worker.id} received`)
	})
}