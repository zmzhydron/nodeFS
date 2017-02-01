/*
	@2017-1-30
	模板文件
	
*/
import React from "react"
import $ from "jquery"
export default class App extends React.Component{
	constructor(props){
		super();
	}
	componentWillMount(){

	}
	componentDidMount(){
		var socket = io.connect('http://localhost:8080');
		socket.on('news', function (data) {
		  console.log(data, "iiiiiiiiioooooooooo");
		  socket.emit('my other event', { my: 'data' });
		});
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
		console.log(window.MediaSource);
		let mediaSource = new MediaSource();
		let video = this.refs.v;
		video.src = window.URL.createObjectURL(mediaSource);
		mediaSource.addEventListener('webkitsourceopen', function(e)
		{
		    var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
		    var socket = io.connect('http://localhost:3000');
		    if(socket)
		        console.log('Library retrieved!');
		    socket.emit('VIDEO_STREAM_REQ','REQUEST');
		    socket.on('VS', function (data) 
		    {
		        console.log(data);
		        sourceBuffer.append(data);
		    });
		});
		$.ajax({
			url: '/api/getMedia',
			dataType: "arraybuffer",
			success: function( res ){
				// ms
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
				<video ref="v" src="" controls="controls" height="480" width="640" type="video/webm"></video>
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