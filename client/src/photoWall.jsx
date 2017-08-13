import React from "react"
let socket;
export default class Photowall extends React.Component{
	constructor(props) {
		super();
		this.state = {
			photoStartIndex: 0,
			angle: 0,
			progress: {},
		}
	}
	getPhoto = e => {
		socket.emit("setSoc", '')
		this.setState({
			photoBtnDisable: "disabled"
		})
		let { photoStartIndex = 0, photolist = [] } = this.state;
		$.ajax({
			url: "/api/getPhoto",
			type: 'post',
			data: {
				start: photoStartIndex,
				limit: 5,
			},
			success: (val) =>{
				let { list, total, morePhoto = 0 } = val;
				morePhoto = parseInt(morePhoto);
				console.log(val)
				if(list.length){
					this.setState({
						photoBtnDisable: "",
						photolist: [...photolist, ...list],
						photoStartIndex: photoStartIndex + 5 > total ? photoStartIndex + (total - photoStartIndex) : photoStartIndex + 5,
					})
				}
			}
		})
	}
	initPhotos = e => {
		socket.emit("setSoc", '')
		$.ajax({
			url: "/api/initPhotos",
			type: 'POST',
			data: {
			},
			success: (val) =>{
				console.log(val, " initPhotos")
			}
		})
	}
	renderPhotos = () => {
		let { photolist = [] } = this.state;
		return photolist.map( (item, index) => {
			let { resizeSrc, originSrc, infos = {}, } = item;
			let { name = "" } = infos;
			resizeSrc = resizeSrc.replace(/\\/g,"/");
			let imgStyle = this.resizeImage(infos, resizeSrc, 200);
			let { width, height } = imgStyle;
			imgStyle = { width, height, }
			return (
				<div className="singleImg" onClick={this.popPhoto(item)} key={index}>
					<div className="singleImgDis">
						<img style={imgStyle} src={resizeSrc} />
					</div>
					<div className="singleImgName">{name}</div>
				</div>
			)
		})
	}
	popPhoto = obj => e => { 
		let { resizeSrc, originSrc: src, infos: { width, height, }, infos,  } = obj;
		console.log(obj, " ************  ")
		src = src.replace(/\\/g,"/");
		this.setState({
			popShow: true,
			popSrc: src,
			imgInfos: infos
		})
	}
	closePopup = e => {
		this.setState({
			popShow: false
		})
	}
	resizeImage = (infos, src, max) => {
		let { width, height, } = infos;
		let w = width >= height ? max : (width / height * max);
		let h = width >= height ? (height / width * max) : max;
		return {
			backgroundImage: `url(${src})`,
			height: Math.floor(h),
			width: Math.floor(w),
		}
	}
	rotate = deg => e =>{
		let angle = this.state.angle;
		angle += deg;
		if(angle >= 360 || angle <= -360){
			angle = 0;
		}
		this.setState({
			angle,
		})
	}
	calcStyles = obj => {
		let { width, height, backgroundImage } = obj;
		let { angle } = this.state;
		let _angle = Math.abs(angle);
		let w = width;
		let h = height;
		if(_angle === 90 || _angle === 270){
			let temp;
			temp = height;
			h = width;
			w = temp;
		}
		return {
			imgStyle: { width, height,  transform: `rotate(${angle}deg)`, backgroundImage, },
			popStyle: {width:w, height:h, marginLeft: -(w / 2), marginTop: -(h / 2),}
		}
	}
	componentDidMount(){
		socket = io("http://localhost:8081");
		let _v;
		socket.on("soc", data => {
			console.log(data, "soc give you a message, and her's id")
		})
		socket.on("heartbeat", data => {
			var dataObj = JSON.parse(data);
			console.log("********heartbeat*********")
			console.log(dataObj);
			if(dataObj && Object.keys(dataObj).length){
				let { cur, total, status } = dataObj;
				if(status === '1'){
					this.setState({
						progress: dataObj
					})	
				}
			}
		})
	}
	calProgress = () => {
		const width = 500;
		let max = 0;
		let { progress: { cur: procur, total: prototal,} } = this.state;
		let r = (procur - max )/prototal;
		r = r > 1 ? 1 : r;
		if( r >  1){
			max	 = procur;
			r = 1;
		}
		r = isNaN(r) ? 0 : r;
		return parseInt(r * 100) + "%";

	}
	render(){
		let { photoBtnDisable = '', popSrc = "", popShow = false, imgInfos = {}, angle = 0 } = this.state;
		let { imgStyle } = this.calcStyles(this.resizeImage(imgInfos,popSrc, 650))
		console.log(angle, "  angle  ")
		let percent = this.calProgress();
		return (
			<div>
				<div className={popShow ? `popShow` : `popShow hide`}>
					<div className="showBigPIC" style={imgStyle}></div>
					
					<div className="ctxbar">
						<button onClick={this.rotate(90)}>→</button>
						<button onClick={this.rotate(-90)}>←</button>
						<button onClick={this.savePicInof}>SAVE</button>
						<button onClick={this.closePopup}>X</button>
					</div>
				</div>
				<button disabled={photoBtnDisable} onClick={this.getPhoto}>getPhoto</button>
				<button disabled={photoBtnDisable} onClick={this.initPhotos}>initPhotos</button>
				<div className="progressBarCtn">
					<div className="infos"></div>
					<div className="bar">
						<div className="progress" style={{width: percent}}>
							<span className="percentage">{percent}</span>
						</div>
					</div>
				</div>
				<div className="photowall">
					{this.renderPhotos()}
				</div>
			</div>
		)
	}
}