/*
	@2017-1-30
	模板文件
	
*/
import React from "react"
import $ from "jquery"
export default class Accident extends React.Component{
	constructor(props){
		super();
		props.actions.getAccident("C:/Users/Administrator/Desktop/false.txt");
	}
	componentWillMount(){

	}
	componentDidMount(){

	}
	componentWillReceiveProps(){

	}
	componentWillUnMount(){

	}
	componentWillUpdate(){

	}
	componentDidUpdate(){
		
	}
	renderTd = obj => {
		var objList = [];
		for(var s in obj){
			objList.push(obj[s]);
		}
		return objList.map( (item, index) => {
			return (
				<td key={index}>
					{item}
				</td>
			)
		})
	}
	renderTr = () => {
		let { accidents = [] } = this.props;
		return accidents.map( (item, index) => {
			return (
				<tr key={index}>
					{this.renderTd(item)}
				</tr>
			)
		})
	}
	renderTh = () => {
		return (
			<tr>
				<th>地点</th>
				<th>问题</th>
				<th>原因</th>
				<th>损伤</th>
				<th>损伤情况</th>
				<th>修复情况</th>
			</tr>
		)
	}
	render(){
		return (
			<table cellSpacing="0" cellPadding="0" className="normaltable">
				{this.renderTh()}
				{this.renderTr()}
			</table>
		)
	}
}