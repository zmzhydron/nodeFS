/*
	@2017-1-30
	显示查询到的文件夹内的所有文件/文件夹
	
*/
import React from "react"
import $ from "jquery"
export default class TableList extends React.Component{
	constructor(props){
		super();
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
	renderTR = list =>{

	}
	renderTH = () => {
		// let { indexProps: { rootList = [] } } = this.props;

		return (
			<thead>
				<tr className="fileItems title">
					<th>类型</th>
					<th>文件名</th>
					<th>大小</th>
				</tr>
			</thead>
		)
	}
	renderTD = () => {
		let { indexProps: { rootList = [] } } = this.props;
		rootList.unshift({
			type: "类型",
			name: "文件名",
			size: "大小",
			isFirst: true
		})
		return rootList.map( (item, index) => {
			let { size, type, name, lstatObj, isFirst = false } = item,
					liKalss = "fileItems"+ isFirst ? "title" : "";
			return (
				<tr className={ isFirst ? "fileItems title": "fileItems" } key={index}>
					<td>{name}</td>
					<td>{type}</td>
					<td>{size}</td>
				</tr>
			)
		})
	}
	render(){
		console.log(this.props);
		return (
			<div className="tableListCtn">
				<h1>thisis tableList</h1>
				<table cellSpacing="0" cellPadding="0">
					{this.renderTD()}
				</table>
			</div>
		)
	}
}