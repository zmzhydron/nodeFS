/*
	@2017-1-30
	显示查询到的文件夹内的所有文件/文件夹
	
*/
import React from "react"
import $ from "jquery"
export default class TableList extends React.Component{
	constructor(props){
		super();
		this.state = {
			name: "zhangmingzhi"
		};
		console.log(props)
		
	}
	componentWillMount(){
		this.getSummary(this.props);
	}
	componentDidMount(){
	}
	componentWillReceiveProps(newProps, newState){
		this.getSummary(newProps);
	}
	componentWillUnMount(){

	}
	componentWillUpdate(){

	}
	componentDidUpdate(){
		
	}
	getSummary = props => {
		let { indexProps: { rootList = [] } } = props,
				totalSize = 0,
				totalFiles = 0,
				totalDir = 0;
		rootList.forEach( (item, index) => {
			let { size = 0, type } = item;

			totalSize += size;
			if(type === 'dir'){
				totalDir++;
			}
			if(type === 'file'){
				totalFiles++;
			}
		})
		console.log("totalSize", totalSize);
		this.setState({
			totalSize: this.getProperSize(totalSize),
			totalFiles,
			totalDir,
		})

	}
	getProperSize = size => {
		var danwei = "KB";
		size = size / 1000;
		if(size / 1000 > 1){
			danwei = 'MB';
			size = size / 1000;
			if(size / 1000 > 1){
				danwei = 'GB';
				size = size / 1000;
			}
		}
		size = size + "";
		var r = /(\..+)/.test(size);
		return size.replace(/(\..+)/, RegExp.$1.substring(0,3)) + danwei;
	}
	requestFiles = src => {
		let { actions: { test, requestRoot } } = this.props;
		requestRoot({
			path: src
		});
	}
	renderTD = () => {
		let { indexProps: { rootList = [] } } = this.props,
				regList = ['.mkv','.mp4','.wmv','.rmvb','.avi', '.mov'];
		rootList = [{
			type: "类型",
			name: "文件名",
			size: "大小",
			isFirst: true
		}, ...rootList];
		var renderTds = rootList.map( (item, index) => {
			let { size = 0, type, name, lstatObj, isFirst = false } = item,
					liKalss = "fileItems"+ isFirst ? "title" : "";
			if(index >= 1){
				size = this.getProperSize(size);
			}
			let nameKlass = "",
					fileType = type;
			if(type === "dir"){
				nameKlass = "fileBlue";
			}else{
				let isMedia = false;
				regList.forEach( item => {
					if(new RegExp(item, "i").test(name)){
						isMedia = true;
					}
				})
				if(isMedia){
					fileType = 'meida';
					nameKlass = 'fileGreen';
				}
			}

			return (
				<tr className={ isFirst ? "fileItems title": "fileItems" } key={index}>
					<td data-index={index-1} data-Filetype={fileType} className={nameKlass} onClick={this.enterFn}>{name}</td>
					<td>{type}</td>
					<td>{size}</td>
				</tr>
			)
		})
		return renderTds;
	}
	enterFn = e => {
		let ele = e.target,
				index = parseInt(ele.getAttribute("data-index")),
				type = ele.getAttribute("data-Filetype"),
				{ indexProps: { rootList = [] } } = this.props;
		if(index < 0){
			return false;
		}
		let currentObj = rootList[index],
				{ path } = currentObj;
		if(type === 'file'){
			return false;
		}else if(type === 'meida'){
			this.playMeida(path);	
		}else{
			this.requestFiles(path);		
		}
	}
	playMeida = src => {
		let { actions: { setPlaySrc } } = this.props;
		// setPlaySrc(src);
		$.ajax({
				url: "/api/getMedia?src="+src,
				type: 'get',
				success: function(res){
					console.log(res, "ressssssssssssssss");
					setPlaySrc('http://localhost:3000/api/getMedia');
				}
			})
	}
	render(){
		let { totalSize = 0, totalFiles = 0, totalDir = 0 } = this.state;
		console.log("render ONCE")
		return (
			<div className="tableListCtn">
				<h1>thisis tableList</h1>
				<div className="fssummarys">
					<span>占用大小：</span>
					<span>{totalSize}</span>
					<span>文件数：</span>
					<span>{totalFiles}</span>
					<span>文件夹数量：</span>
					<span>{totalDir}</span>
				</div>
				<table cellSpacing="0" cellPadding="0">
					{this.renderTD()}
				</table>
			</div>
		)
	}
}