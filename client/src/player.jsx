/*
	@2017-1-30
	模板文件
	
*/
import React from "react"
import $ from "jquery"
export default class App extends React.Component{
	constructor(props){
		super();
		this.socket = io.connect('http://localhost:8080');
	}
	componentWillMount(){

	}
	componentDidMount(){
	}
	componentWillReceiveProps(){

	}
	componentWillUnMount(){

	}
	componentWillUpdate(){

	}
	componentDidUpdate(){
		
	}
	play = () => {
		let	mediaSource = new MediaSource(),
				video = this.refs.v,
				that = this,
				queue = [],
				MP4 = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
				webm = 'video/webm; codecs="vorbis,vp8"',
				videoPromise,
				sourceBuffer;
		video.src = window.URL.createObjectURL(mediaSource);
		mediaSource.addEventListener('sourceopen', function(o){
			video.play();
			// videoPromise = video.play();
			// videoPromise.then( function(){
			// 	// debugger;
			// 	console.log(`play!!!!!!!!`)
			// }).catch( function(error){
			// 	console.log(error);
			// 	// debugger;
			// })
		  sourceBuffer = mediaSource.addSourceBuffer(webm);
		  sourceBuffer.addEventListener("update", function(){
		  	console.log("@@@@@@@@@@@@@@@@@@", sourceBuffer.updating, queue.length);
		  	if(queue.length > 0 && !sourceBuffer.updating){
		  		sourceBuffer.appendBuffer(queue.shift())
		  	}
		  }, false);
		}, false);
		that.socket.emit('requestMedia', { src: 'C:/22/test2.webm' });
		that.socket.on("media", function(data){		  	
			// that.socket.emit("pauseMedia");BMW X5BMW X5
			if(sourceBuffer.updating || queue.length > 0){
				queue.push(data);	
			}else{
				console.log(data);
				sourceBuffer.appendBuffer(data);
			}
		})
	}
	renderPlayer = () => {
		let { playSrc = false } = this.props;
		console.log(playSrc, "************ playSrc ************");
		// {
		// 			playSrc ? this.renderPlayer() : "没有文件可以播放"
		// 		}
		return (
			<div>
				<video ref="v" src="http://v2v.cc/~j/theora_testsuite/320x240.ogg" controls="controls" height="480" width="640"></video>
			</div>
		)
	}
	render(){
		let { playSrc = false } = this.props;
		return (
			<div className="palya">
				{this.renderPlayer()}
				<button onClick={this.play}>play</button>
			</div>
		)
	}
}