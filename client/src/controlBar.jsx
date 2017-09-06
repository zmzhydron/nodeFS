/*
	@2017-1-30
	控制面板
	
*/
import React from "react"
import { fadeIn } from 'react-animations'
// import $ from "jquery"
export default class App extends React.Component{
	constructor(props){
		debugger;
		super();
		let { actions: { requestRoot }, currentPath } = props;
		requestRoot({
			path: currentPath
		});
	}
	componentWillMount(){

	}
	componentWillReceiveProps(){

	}
	componentWillUnMount(){

	}
	componentWillUpdate(){

	}
	componentDidMount(){
		this.refs.pathInputBoxs.value = this.props.currentPath;
	}
	componentDidUpdate(){
		this.refs.pathInputBoxs.value = this.props.currentPath;	

	}
	changePath = e => {
		let ele = e.target,
				value = ele.value,
				{ actions: { changePath }} = this.props;
		changePath(value);
	}
	trigger = value =>{
		let { actions: { requestRoot }, currentPath } = this.props;
		requestRoot({
			path: currentPath
		});
	}
	render(){
		console.log(fadeIn, " fadeIn ");
		console.log(tools.hi(), " ~~~~~~~~~~~!!");
		return (
			<div>
				<h1>this is controlaaaaaaaa</h1>
				<div className="serverBar">
					<span>222222222222222</span>
					<img src="./pus/1.png" alt="" />
					<input ref="pathInputBoxs" onBlur={this.changePath}/>
					<button id="fuckyoubutton" onClick={this.trigger}>click me!111</button>
				</div>
			</div>
		)
	}
}