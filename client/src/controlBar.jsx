/*
	@2017-1-30
	控制面板
	
*/
import React from "react"
// import $ from "jquery"
export default class App extends React.Component{
	constructor(props){
		super(props);
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
		//DLL 55b412957cbadfdd6684
		//DLL 55b412957cbadfdd6684
				//55b412957cbadfdd6684
		console.log("~~!!~!!!")
		console.log("~~!!~!!!")
		return (
			<div>
				<h1>this is cont222rol panel111</h1>
				<div className="serverBar">
					<input ref="pathInputBoxs" onBlur={this.changePath}/>
					<button id="fuckyoubutton" onClick={this.trigger}>click me!111</button>
				</div>
			</div>
		)
	}
}