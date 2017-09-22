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
import DbControl from "./dbControl.jsx"
import PhotoWall from "./photoWall.jsx"
import Pacong from "../pacong.jsx"

import Accident from "./carAccident.jsx"

 class App extends React.Component{
	constructor(props){
		super();
		this.state = {
			dbon: true
		}
	}
	componentDidMount(){
		var that = this;
		$("#jquerytest").bind("click", function(){
			that.props.actions.testone('zhangmingzhi')
			that.props.actions.testtwo('2500k')
			
		})
	}
	componentDidUpdate(){
	}
	dbswitch = () => {
		let { dbon } = this.state;
		this.setState({
			dbon: !dbon
		})
	}
	testone = () =>{
		this.props.actions.testtwo('2500k')
		this.props.actions.testone('zhangmingzhi')
	}
 	render(){
		let { indexProps: { me, rootValue, newCar, price }, indexProps, actions } = this.props;
		let { dbon } = this.state;
		let klassdba = dbon ? "hide" : ""
		let klassdbb = dbon ? "" : "hide"
				// 		<h1>My name is zhangmingzhi, and this is file operating system!</h1>
				// <h3>{newCar} and the price is : {price}</h3>
				// <button id="jquerytest">test middleware</button>
				// <button id="dbtest" onClick={this.dbswitch}>db开关</button>

				//<ControlBar {...indexProps} actions = {actions}/>
				//<DbControl {...this.props}/>
		return (
			<div>
			<Pacong {...this.props}/>
				<div className = {klassdba}>
					{/*<Chat {...indexProps} />*/}
					{/*<Player {...indexProps} />*/}
					
					{/*<Accident {...indexProps} actions = {actions}/>*/}
					{/*<TableList {...this.props}/>*/}
				</div>
				<div className = {klassdbb}>
					
				</div>
				{/*<PhotoWall />*/}
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