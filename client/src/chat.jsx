/*
	@2017-1-30
	模板文件
	
*/
import React from "react"
import $ from "jquery"
export default class Chat extends React.Component{
	constructor(props){
		super();
		this.socket = io.connect('http://localhost:8080/chat');
		this.state = {
			autoScroll: true,
			loginState: false,
			username: "",
			message: [],
			totalUser: 1,
			msg: "!"
		}
		this.socket.on('selfTalk', this.onMessage('selfTalk'));
		this.socket.on('broadcast', this.onMessage('broadcast'));
		this.socket.on('loginSuccess', resp => {
			this.loginState = true;
		})
		this.socket.on("userSumChange", resp => {
			// console.log("userSumChange", resp.userCount);
			this.setState({
				totalUser: parseInt(resp.userCount)
			})
		})
		this.loginState = false;
	}
	onMessage = type => resp => {
		let { message } = this.state,
				{ name, msg: value, isSelf = false } = resp;
		message = message.concat({ name, value, type, isSelf });
		this.setState({
			message,
		})
	}
	componentWillMount(){
	}
	componentDidMount(){
		this.refs.msginput.value = this.state.msg;
	}
	componentWillReceiveProps(){

	}
	componentWillUnMount(){

	}
	componentWillUpdate(){

	}
	componentDidUpdate(){
		let { msginput, chatContent } = this.refs,
				{ autoScroll } = this.state;
		msginput.value = this.state.msg;
		if(autoScroll){
			chatContent.scrollTop = chatContent.scrollHeight - chatContent.offsetHeight;	
		}
	}
	sendMessage = e => {
		let { msg, username, loginState } = this.state;
		if(!username){
			alert("username is empty")
			return false;
		}
		if(!this.loginState){
			this.socket.emit("userLogin", { username: username});
			return false;
		}
		this.socket.emit("newMessage", {
			name: username,
			msg,
		}) 
		this.setState({
			msg: '',
		})
	}
	blur = type => e => {
		this.setState({
			[type]: e.target.value
		})
	}
	renderMessage = () =>{
		let { message } = this.state;
		return message.map( (item, index) => {
			let { name, value, isSelf } = item,
					liKlass = isSelf ? "oneMessage myself" : "oneMessage";
			let curname = isSelf ? (":" + name) : (name + ": ");
			return (
				<li key = {index} className={liKlass}>
					<span className="username">{curname}</span>
					<span className="usermessage">{value}</span>
				</li>
			)
		})
	}
	checkBoxchange = e => {
		let val = e.target.value;
		this.setState({
			autoScroll: val === 'true' ? false : true
		})
	}
	render(){
		let { autoScroll, totalUser = 1 } = this.state,
				checkedState = autoScroll ? "checked" : "";
				// console.log(totalUser, "totalUser");
		return (
			<div className="chatBorder">
				<div className="chatStatusBar">
					<div>在线用户：{totalUser}</div>
				</div>
				<ul ref="chatContent" className="chatContent">
					{this.renderMessage()}
				</ul>
				<div className="chatCtr">
					<input ref="msginput" type="text" onBlur={this.blur('username')}/>
					<input ref="msginput" type="text" onBlur={this.blur('msg')}/>
					<button onClick={this.sendMessage}> sendMessage </button>
					<input type="checkBox" value={autoScroll} checked={checkedState} onChange={this.checkBoxchange} /> scrollOrNot
				</div>
			</div>
		)
	}
}