/*
	@2017-1-30
	控制面板
*/
import React from "react"
export default class App extends React.Component{
	constructor(props){
		super();
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
	}
	componentDidUpdate(){
	}
	connect = () => {
		$.ajax({
			url: '/api/connectDb',
			type: 'post',
			data: {
				name: "zmz",
			},
			success: function(res){
				console.log(res);
			}
		})
	}
	getCollections = () => {
		$.ajax({
			url: '/api/testDb',
			type: 'post',
			data: {
				name: "zmz",
			},
			success: function(res){
				console.log(res);
			}
		})
	}
	addCollection = () => {
		$.ajax({
			url: '/api/addCollection',
			type: 'post',
			data: {
				name: "zmz",
				initCol: {
					name: "zhangmingzhi",
					age: "去你妈的"
				}
			},
			success: function(res){
				console.log(res);
			}
		})
	}
	query = () => {
		$.ajax({
			url: '/api/query',
			type: 'post',
			data: {
				collname: "zmz",
			},
			success: function(res){
				console.log(res);
			}
		})
	}
	queryAndupdate = () => {
		$.ajax({
			url: '/api/queryAndupdate',
			type: 'post',
			data: {
				collname: "zmz",
			},
			success: function(res){
				console.log(res);
			}
		})
	}
	render(){
		return (
			<div>
				<h1>DB control panel</h1>
				<button onClick={this.connect}>连接数据库</button>
				<button onClick={this.getCollections}>getCollections</button>
				<button onClick={this.addCollection}>addCollection One</button>
				<button onClick={this.query}>querys One</button>
				<button onClick={this.queryAndupdate}>queryAndupdate</button>
			</div>
		)
	}
}