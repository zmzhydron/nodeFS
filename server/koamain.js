var app = new koa();
	var soc;
	// var mongoApi = require("./db/mongoose.js")
	app.use(async (o, next) =>{
		try{
			// process.on("message", data => {
			// 	console.log(` message from abouv : ${data}`)
			// })
			// process.send(`${cluster.worker.id} is Process your requrst`)
			o.io = soc; //bind socket to koa request instances
			await next();
		}catch(err){
			o.response.status = 500;
			o.body = {
				errorCode: 0,
				message: err+" >> "+o.outfit+ " >> "+o.url
			};
		}
	})
	app.use(koabody())
	app.use(async (o,next) => {
		// throw new Error("去屎吧")
		// console.log(o.query,o.querystring, o.body,"  queryyyyyyyyyyyyyyy ")
		// o.throw(500, 'name required'); //也可以绕过第一个错误处理的方法；
		await next();
	})
	app.use(koatools.test())
	app.use(router.routes()).use(router.allowedMethods())
	router.get("/api/rr",async (o, next) =>{
		o.pos = 'ride';
		o.isrr = true;
		await next();
	})
	router.get("/api/",async (o, next) =>{
		o.pos = 'ride';
		o.isrr = true;
		await next();
	})
	// router.get("/api/getCollections",mongoApi.getCollections())

	router.get("/api/download",koas.download())
	router.post("/api/getPhoto",koas.getPhoto())
	router.post("/api/initPhotos",koas.initPhotos())
	app.use(async(o,next) => {
		// o.body = `i am zmz, and i say:`;
		await next();
		// o.body += " :D"
	})
	router.post("/api/upload", upload.single("fuckyoutoo"), koas.upload())
	app.use( async (o, next) =>{
		if(o.isrr){
			o.outfit = "nothing"	
			this.two = 'hight heels'
			// console.log(o)
			// console.log(this)
		}else{
			o.outfit = 'black lace'
		}

		o.body = ` ^^ ${this.two} kendra lust wear ${o.outfit} and suck it down >>> ${o.pos} style`;
	})
	var server = app.listen(0);
	var io = socketIO(server);
	process.on("message", (msg, handler) => {
		if(msg !== "sticky-session"){
			console.log("koa.js, cluster socket.io need font-facing server response first!!!")
			return;
		}
		server.emit("connection", handler);
		handler.resume();
	})
	io.on("connection", socket => {
		socket.emit("haha", obj);
		socket.on("setSoc", msg => {
			soc = socket;
		})
	})
module.exports = koa_thread;

