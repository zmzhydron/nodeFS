/*
	@2017-1-30
	控制面板
*/
import React from "react"
export default class App extends React.Component {
	constructor(props) {
		super();
		this.state = {
			showADDCar: true,
			cars: []
		}
	}
	componentWillMount() {

	}
	componentWillReceiveProps() {

	}
	componentWillUnMount() {

	}
	componentWillUpdate() {

	}
	componentDidMount() {
	}
	componentDidUpdate() {
	}
	getCollections = () => {
		$.ajax({
			url: '/api/getCollections',
			type: 'post',
			data: {
				name: "zmz",
			},
			success: res => {
				this.setState({
					cars: res
				})
			}
		})
	}
	subCars = (_id,index) =>  e => {
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
			success: function (res) {
				console.log(res);
			}
		})
	}
	updateCar = (id,index) => e => {
		$.ajax({
			url: '/api/updateCar',
			type: 'post',
			data: {
				bhp: 999
			},
			success: function (res) {
				console.log(res);
			}
		})
	}
	deleteCar = (id,index) => e => {
		$.ajax({
			url: '/api/deleteCar',
			type: 'post',
			data: {
				id,
				index,
			},
			success: res =>  {
				this.setState({
					cars: res
				})
			}
		})
	}
	showADDCar = e => {
		this.setState({
			showADDCar: !this.state.showADDCar
		})
	}
	renderTableBtn = (_id, index) => {
		return (
			<div>
				<button onClick={this.subCars(_id,index)}>add</button>
				<button onClick={this.updateCar(_id,index)}>update</button>
				<button onClick={this.deleteCar(_id,index)}>remove</button>
			</div>
		)
	}
	renderCars = () => {
		let { cars, showADDCar } = this.state;
		return cars.map((item, index) => {
			let { _id, carName, fuelType, driveType, bhp, torque, gearbox, gearNumber, acceleration, door, price } = item;
			return (
				<tr key={index} data-id={_id}>
					<td>{index + 1}</td>
					<td>{carName}</td>
					<td>{price}</td>
					<td>{acceleration}</td>
					<td>{fuelType}</td>
					<td>{driveType}</td>
					<td>{bhp}</td>
					<td>{torque}</td>
					<td>{gearbox}</td>
					<td>{gearNumber}</td>
					<td>{door}</td>
					<td>{this.renderTableBtn(_id,index)}</td>
				</tr>
			)
		})
	}
	render() {
		let { showADDCar } = this.state;
		return (
			<div>
				<h1>DB control panel</h1>
				<button onClick={this.getCollections}>查询车辆</button>
				<button onClick={this.showADDCar}>显示添加车辆</button>
				<div style={{ display: showADDCar ? "block" : "none" }}>
					<h2>自定义添加</h2>
					<span>数据库名称：<input type="text" defaultValue="zmz" /></span>
					<span>集合名称：<input type="text" defaultValue="zmz" /></span>
					<div>
						<span>车名：<input type="text" id="carName" defaultValue="zmz" /></span>
						<span>price: <input type="text" id="price" defaultValue="140k" /></span>
						<div>驱动方式：
							<label htmlFor="fr">2驱动</label>
							<input type="radio" name="drivetype" id="fr" defaultValue="fr" />
							<label htmlFor="4wr">四驱</label>
							<input type="radio" name="drivetype" id="4wr" defaultValue="4wr" />
							<label htmlFor="rr">后驱</label>
							<input type="radio" name="drivetype" id="rr" defaultValue="rr" />
						</div>
						<div>燃油方式：
							<label htmlFor="gas">汽油</label>
							<input type="radio" name="fueltype" id="gas" defaultValue="gas" />
							<label htmlFor="disel">柴油</label>
							<input type="radio" name="fueltype" id="disel" defaultValue="disel" />
							<label htmlFor="hydrid">混动</label>
							<input type="radio" name="fueltype" id="hydrid" defaultValue="hydrid" />
							<label htmlFor="eletric">纯电</label>
							<input type="radio" name="fueltype" id="eletric" defaultValue="eletric" />
						</div>
						<span>马力：<input type="text" id="bhp" defaultValue="991" /></span>
						<span>扭矩：<input type="text" id="torque" defaultValue="500" /></span>
						<span>变数箱：<input type="text" id="gearbox" defaultValue="dct" /></span>
						<span>档位：<input type="text" id="gearNumber" defaultValue="9" /></span>
						<span>百公里加速度：<input type="text" id="acceleration" defaultValue="4.7" /></span>
						<div>门数：
							<label htmlFor="2door">2门</label>
							<input type="radio" name="door" id="2door" defaultValue="2door" />
							<label htmlFor="4door">四门</label>
							<input type="radio" name="door" id="4door" defaultValue="4door" />
						</div>
						<div>
							<button onClick={this.subCars}>提交</button>
							<button onClick={this.updateCar}>updateCar</button>
							<button onClick={this.deleteCar}>删除没有价格的车</button>
						</div>
					</div>
				</div>
				<table className="cartable">
					<tr>
						<th>index</th>
						<th>名称</th>
						<th>价格</th>
						<th>百公里加速</th>
						<th>燃油类型</th>
						<th>驱动类型</th>
						<th>马力</th>
						<th>扭矩</th>
						<th>变数箱</th>
						<th>档位</th>
						<th>门数</th>
						<th>操作</th>
					</tr>
					{this.renderCars()}
				</table>
			</div>
		)
	}
}