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
		var fuelType = $("input[name=fueltype]:checked").val();
		var door = $("input[name=door]:checked").val();
		var driveType = $("input[name=driveType]:checked").val();
		var carName = $("#carName").val();
		var bhp = $("#bhp").val();
		var torque = $("#torque").val();
		var gearbox = $("#gearbox").val();
		var gearNumber = $("#gearNumber").val();
		var acceleration = $("#acceleration").val();
		var price = $("#price").val();
		$.ajax({
			url: '/api/addCar',
			type: 'post',
			data: {
				fuelType: fuelType,
				door: door,
				driveType: driveType,
				carName: carName,
				bhp: bhp,
				torque: torque,
				gearbox: gearbox,
				gearNumber: gearNumber,
				acceleration: acceleration,
				price: price
			},
			success: function(res){
				console.log(res);
			}
		})
	}
	updateCar = e => {
		$.ajax({
			url: '/api/updateCar',
			type: 'post',
			data: {
				bhp: 999
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
				<button onClick={this.addCollection}>addtest</button>
				<button onClick={this.query}>querys One</button>
				<button onClick={this.queryAndupdate}>queryAndupdate</button>
				<div>
					<h2>自定义添加</h2>
					<span>数据库名称：<input type="text"  defaultValue="zmz"/></span>
					<span>集合名称：<input type="text" defaultValue="zmz"/></span>
					<div>
						<span>车名：<input type="text" id="carName" defaultValue="zmz"/></span>
						<span>price: <input type="text" id="price" defaultValue="140k"/></span>
						<div>驱动方式：
							<label htmlFor="fr">2驱动</label>
							<input type="radio" name="drivetype" id="fr" defaultValue="fr"/>
							<label htmlFor="4wr">四驱</label>
							<input type="radio" name="drivetype" id="4wr" defaultValue="4wr"/>
							<label htmlFor="rr">后驱</label>
							<input type="radio" name="drivetype" id="rr" defaultValue="rr"/>
						</div>
						<div>燃油方式：
							<label htmlFor="gas">汽油</label>
							<input type="radio" name="fueltype" id="gas" defaultValue="gas"/>
							<label htmlFor="disel">柴油</label>
							<input type="radio" name="fueltype" id="disel" defaultValue="disel"/>
							<label htmlFor="hydrid">混动</label>
							<input type="radio" name="fueltype" id="hydrid" defaultValue="hydrid"/>
							<label htmlFor="eletric">纯电</label>
							<input type="radio" name="fueltype" id="eletric" defaultValue="eletric"/>
						</div>
						<span>马力：<input type="text" id= "bhp" defaultValue="991"/></span>
						<span>扭矩：<input type="text" id= "torque" defaultValue="500"/></span>
						<span>变数箱：<input type="text" id= "gearbox" defaultValue="dct"/></span>
						<span>档位：<input type="text" id= "gearNumber" defaultValue="9"/></span>
						<span>百公里加速度：<input type="text" id= "acceleration" defaultValue="4.7"/></span>
						<div>门数：
							<label htmlFor="2door">2门</label>
							<input type="radio" name="door" id="2door" defaultValue="2door"/>
							<label htmlFor="4door">四门</label>
							<input type="radio" name="door" id="4door" defaultValue="4door"/>
						</div>
						<div>
							<button onClick={this.subCars}>提交</button>
							<button onClick={this.updateCar}>updateCar</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}