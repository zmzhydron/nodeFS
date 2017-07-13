/*
	@2017-1-30
	控制面板
*/
import React from "react"

let one = val => (resolve, reject) =>{
	$.ajax({
		url: '/api/one',
		type: 'post',
		data: {
			name: "zmz",
		},
		success: res => {
			let { status, url } = res
			if(status === 'ok'){
				resolve(url);
			}else{
				reject("reject by one");
			}
			
		}
	})
}
let two = val => (resolve, reject) =>{
	$.ajax({
		url: `/api/${val}`,
		type: 'post',
		data: {
			name: "zmz",
		},
		success: res => {
			let { status, url } = res
			if(status === 'ok'){
				resolve(url);
			}else{
				reject('reject by two');
			}
			
		}
	})
}


function pro(val, callback){
	return new Promise(callback(val))
}
export default class App extends React.Component {
	constructor(props) {
		super();
		this.state = {
			showADDCar: false,
			cars: [],
			ext: {}
		}
	}
	componentWillMount() {

	}
	componentWillReceiveProps(newProps) {
		this.setState({
			ext: $.extend(true, {}, newProps.indexProps.ext)
		})
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
		let tool = tools.tools;
		let final = val => (resolve, reject) =>{
			$.ajax({
				url: `/api/${val}`,
				type: 'post',
				data: {
					name: "zmz",
				},
				success: res => {
					let { status, data, } = res
					if(status === 'ok'){
						resolve(data);
					}else{
						reject(res);
					}
					
				}
			})
		}
		function *gen(val){
			// let cc = confirm("azmz");
			// if(cc){
			// 	console.log(cc)
			// }else{
			// 	console.log("aaa")
			// 	// return Promise.resolve("false");
			// 	return []
			// }
			var a = yield pro(val,one)
			var b = yield pro(a,two)
			var c = yield pro(b,final)
		}
		tool.zoo(gen, 'zmz').then( val => {
			console.log(val)
			val = val ? val : [];
			this.setState({
				cars: val
			})
		}).catch( val => {
			console.log(` final value is ${val}`)
		})
	}
	subCars = e => {
		var fuelType = $("input[name=fueltype]:checked").val();
		var door = $("input[name=door]:checked").val();
		var driveType = $("input[name=driveType]:checked").val();
		var carName = $("#carName").val();
		var bhp = $("#bhp").val();
		var torque = $("#torque").val();
		var gearbox = $("input[name=gearbox]:checked").val();
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
			success: res =>  {
				this.setState({
					cars: res
				})
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
	queryCars = e => {
		$.ajax({
			url: '/api/queryMycar',
			type: 'post',
			data:{},
			success: res =>  {
				console.log(res);
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
	testExtend = () => {
		$.ajax({
			url: `api/hello?name=zmz&age=29`,
			success: val =>{
				console.log(val)
			}
		})
		$.ajax({
			url: `api/rr?name=zmz&age=30`,
			success: val =>{
				console.log(`${val} RR`)
			}
		})
	}
	upload = e =>{
		let forms = new FormData();
		forms.append("fuckyoutoo", e.target.files[0]);
		forms.append("fuckyou", 'fuckyoubitch');
		console.log(forms);
		$.ajax({
			url: "/api/upload",
			type: 'post',
			contentType : false,
			processData : false, 
			data: forms,
			success: function(val){
				console.log(val, `by uploading this <thing>		</thing>`)
			}
		})
	}
	render() {
		let { showADDCar } = this.state;
		//<table className="cartable">
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
		//</table>
		return (
			<div>
				<input type="file" onChange={this.upload}/>
				<h1>DB control panel <button onClick={this.testExtend}>test extends</button></h1>
				<button onClick={this.getCollections}>查询</button>
				<button onClick={this.showADDCar}>显示添加</button>
				<div style={{ display: showADDCar ? "block" : "none" }}>
					<h2>自定义添加</h2>
					<div>
						<span>车名：<input type="text" id="carName" defaultValue="zmz" /></span>
						<span>price: <input type="text" id="price" defaultValue="140k" /></span>
						<div>驱动方式：
							<input type="radio" name="drivetype" id="fr" defaultValue="fr" />
							<label htmlFor="fr">2驱动</label>
							<input type="radio" name="drivetype" id="4wr" defaultValue="4wr" />
							<label htmlFor="4wr">四驱</label>
							<input type="radio" name="drivetype" id="rr" defaultValue="rr" />
							<label htmlFor="rr">后驱</label>
						</div>
						<div>燃油方式：
							<input type="radio" name="fueltype" id="gas" defaultValue="gas" />
							<label htmlFor="gas">汽油</label>
							<input type="radio" name="fueltype" id="disel" defaultValue="disel" />
							<label htmlFor="disel">柴油</label>
							<input type="radio" name="fueltype" id="hydrid" defaultValue="hydrid" />
							<label htmlFor="hydrid">混动</label>
							<input type="radio" name="fueltype" id="eletric" defaultValue="eletric" />
							<label htmlFor="eletric">纯电</label>
						</div>
						<span>马力：<input type="text" id="bhp" defaultValue="991" /></span>
						<span>扭矩：<input type="text" id="torque" defaultValue="500" /></span>
						<div>变数箱：
							<input type="radio" name="gearbox" id="manuel" value="manuel" />
							<label htmlFor="manuel">手动</label>
							<input type="radio" name="gearbox" id="sequen" value="sequen" />
							<label htmlFor="sequen">序列</label>
							<input type="radio" name="gearbox" id="auto" value="auto" />
							<label htmlFor="auto">自动</label>
						</div>
						<span>档位：<input type="text" id="gearNumber" defaultValue="9" /></span>
						<span>百公里加速度：<input type="text" id="acceleration" defaultValue="4.7" /></span>
						<div>门数：
							<input type="radio" name="door" id="2door" defaultValue="2door" />
							<label htmlFor="2door">2门</label>
							<input type="radio" name="door" id="4door" defaultValue="4door" />
							<label htmlFor="4door">四门</label>

						</div>
						<div>
						</div>
					</div>
				</div>
				<button onClick={this.subCars}>提交new car</button>
				<button onClick={this.queryCars}>查询特定</button>

			</div>
		)
	}
}