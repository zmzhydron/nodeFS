import React from "react"
import ReactDom from "react-dom"
import { bindActionCreators } from "redux"
import * as actions from "./redux/actions/indexAction.js"
import { connect } from "react-redux"
import $ from "jquery"


import TableList from "./tableList.jsx"
import ControlBar from "./controlBar.jsx"
import Player from "./player.jsx"
import Chat from "./chat.jsx"

 class App extends React.Component{
	constructor(props){
		super();
	}
	componentDidMount(){
	}
	componentDidUpdate(){
	}
 	render(){
		let { indexProps: { me, rootValue }, indexProps, actions } = this.props;
		return (
			<div>
				<h1>My name is zhangmingzhi, and this is file operating system!</h1>
				<Chat {...indexProps} />
				<Player {...indexProps} />
				<ControlBar {...indexProps} actions = {actions}/>
				{/*<TableList {...this.props}/>*/}
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