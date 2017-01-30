import React from "react"
import ReactDom from "react-dom"
import { bindActionCreators } from "redux"
import * as actions from "./redux/actions/indexAction.js"
import { connect } from "react-redux"
import $ from "jquery"


import TableList from "./tableList.jsx"
 class App extends React.Component{
	constructor(props){
		super();
		this.state = {
			currentPath: 'C:/Users/Administrator/Desktop'
		}
	}
	trigger = (value) =>{
		let { actions: { test, requestRoot } } = this.props,
				{ currentPath } = this.state;
		requestRoot({
			path: currentPath
		});
	}
	componentDidMount(){
		this.refs.pathInputBox.value = this.state.currentPath;
	}
	componentDidUpdate(){
		this.refs.pathInputBox.value = this.state.currentPath;	
	}
	changePath = e => {
		let ele = e.target,
				value = ele.value;
		this.setState({
			currentPath: value
		})
	}
 	render(){
		let { indexProps: { me, rootValue } } = this.props,
				{ currentPath } = this.state;
		return (
			<div>
				<h1>My name is zhangmingzhi, and this is file operating system!</h1>
				<TableList {...this.props}/>
				<div className="serverBar">
					<input ref="pathInputBox" onBlur={this.changePath}/>
					<button id="fuckyoubutton" onClick={this.trigger}>click me!</button>
				</div>
				
			</div>
		)
	}
}
export default connect(
	state => {
		return {
			indexProps: state.index
		}
	},
	dispatch => {
		return {
			actions: bindActionCreators(actions, dispatch)
		}
	}
)(App);