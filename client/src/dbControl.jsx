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
			url: '/api/getCollections',
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
			url: '/api/getCollections',
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
	subCars = e => {
		var fueltype = $("input[name=fueltype]:checked");
		var door = $("input[name=fueltype]:checked");
		var drivetype = $("input[name=fueltype]:checked");
		console.log(fueltype)
	}
	render(){
		return (
			<div>
				<h1>DB control panel</h1>
				<button onClick={this.connect}>连接数据库</button>
				<button onClick={this.getCollections}>getCollections</button>
				<button onClick={this.addCollection}>addtest</button>
				<button onClick={this.query}>querys One</button>
				<button onClick={this.queryAndupdate}>queryAndupdate</button>
				<div>
					<h2>自定义添加</h2>
					<span>数据库名称：<input type="text" value="zmz"/></span>
					<span>集合名称：<input type="text" value="zmz"/></span>
					<div>
						<span>车名：<input type="text" value="zmz"/></span>
						<div>驱动方式：
							<label htmlFor="fr">2驱动</label>
							<input type="radio" name="drivetype" id="fr" value="fr"/>
							<label htmlFor="4wr">四驱</label>
							<input type="radio" name="drivetype" id="4wr" value="4wr"/>
							<label htmlFor="rr">后驱</label>
							<input type="radio" name="drivetype" id="rr" value="rr"/>
						</div>
						<div>燃油方式：
							<label htmlFor="gas">汽油</label>
							<input type="radio" name="fueltype" id="gas" value="gas"/>
							<label htmlFor="disel">柴油</label>
							<input type="radio" name="fueltype" id="disel" value="disel"/>
							<label htmlFor="hydrid">混动</label>
							<input type="radio" name="fueltype" id="hydrid" value="hydrid"/>
							<label htmlFor="eletric">纯电</label>
							<input type="radio" name="fueltype" id="eletric" value="eletric"/>
						</div>
						<span>马力：<input type="text" value="zmz"/></span>
						<span>扭矩：<input type="text" value="zmz"/></span>
						<span>变数箱：<input type="text" value="zmz"/></span>
						<span>档位：<input type="text" value="zmz"/></span>
						<span>百公里加速度：<input type="text" value="zmz"/></span>
						<div>门数：
							<label htmlFor="2door">2门</label>
							<input type="radio" name="door" id="2door" value="2door"/>
							<label htmlFor="4door">四门</label>
							<input type="radio" name="door" id="4door" value="4door"/>
						</div>
						<div>
							<button onClick={this.subCars}>提交</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}