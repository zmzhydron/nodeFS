/*
	@2017-1-30
	控制面板
	
*/
import React from "react"
import $ from "jquery"
export default class App extends React.Component{
	constructor(props){
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
		this.refs.pathInputBox.value = this.props.currentPath;
	}
	componentDidUpdate(){
		this.refs.pathInputBox.value = this.props.currentPath;	
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
		return (
			<div>
				<h1>this is control panel</h1>
				<div className="serverBar">
					<input ref="pathInputBox" onBlur={this.changePath}/>
					<button id="fuckyoubutton" onClick={this.trigger}>click me!</button>
				</div>
			</div>
		)
	}
}