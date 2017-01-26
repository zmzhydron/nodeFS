import React from "react"
import ReactDom from "react-dom"
import { bindActionCreators } from "redux"
import * as actions from "./redux/actions/indexAction.js"
import { connect } from "react-redux" 
import $ from "jquery"
 class App extends React.Component{
	constructor(props){
		super();
	}
	trigger = (value) =>{
		let { actions: { test, requestRoot } } = this.props;
		test("zhangmingzhi awesome")
		requestRoot("zmz awesome");
	}
	componentDidMount(){
		$("#fuckyoubutton").html("fuck you too button");
	}
	render(){
		let { testProps: { me, rootValue } } = this.props;
		return (
			<div>
				<h1>My name is zhangmingzhi, and this is file operating system!</h1>
				<h2>{me}</h2>
				<div>infosight: {JSON.stringify(rootValue)}</div>
				<button id="fuckyoubutton" onClick={this.trigger}>click me!</button>
			</div>
		)
	}
}
export default connect(
	state => {
		return {
			testProps: state.index
		}
	},
	dispatch => {
		return {
			actions: bindActionCreators(actions, dispatch)
		}
	}
)(App);