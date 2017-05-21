import React from "react"
import ReactDom from "react-dom"
import { bindActionCreators } from "redux"
import * as actions from "./redux/actions/indexAction.js"
import { connect } from "react-redux"
// import $ from "jquery"
import TableList from "./tableList.jsx"
import ControlBar from "./controlBar.jsx"
import Player from "./player.jsx"
import Chat from "./chat.jsx"
import Accident from "./carAccident.jsx"

 class App extends React.Component{
	constructor(props){
		super();
	}
	componentDidMount(){
		var that = this;
		$("#jquerytest").bind("click", function(){
			that.props.actions.testtwo('2500k')
			that.props.actions.testone('zhangmingzhi')
		})
	}
	componentDidUpdate(){
	}
	testone = () =>{
		this.props.actions.testtwo('2500k')
		this.props.actions.testone('zhangmingzhi')
	}
 	render(){
		let { indexProps: { me, rootValue, newCar, price }, indexProps, actions } = this.props;
		
		return (
			<div>
				<h1>My name is zhangmingzhi, and this is file operating system!</h1>
				<h3>{newCar} and the price is : {price}</h3>
				<button id="jquerytest">test middleware</button>
				{/*<Chat {...indexProps} />*/}
				{/*<Player {...indexProps} />*/}
				<ControlBar {...indexProps} actions = {actions}/>
				<Accident {...indexProps} actions = {actions}/>
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