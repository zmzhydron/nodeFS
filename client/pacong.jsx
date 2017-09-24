/*
	@2017-1-30
	控制面板
*/
import React from "react"
let socket;
const typeList = ['windowa', 'windowb', 'windowc', 'windowd', 'windowe'] 
export default class App extends React.Component {
	constructor(props) {
		super();
		this.state = {
			infos: [
				{
					list: [],
					title: "windowa",
					klass: "a"
				}, {
					list: [],
					title: "windowb",
					klass: "b"
				}, {
					list: [],
					title: "windowc",
					klass: "c"
				},
				{
					list: [],
					title: "windowd",
					klass: "d"
				},
								{
					list: [],
					title: "windowe",
					klass: "e"
				}
			]
		}
	}
	componentWillMount() {

	}
	componentWillReceiveProps(newProps) {

	}
	componentWillUnMount() {

	}
	componentWillUpdate() {

	}
	testExtend = () => {
		$.ajax({
			url: `fuckoff/hello?name=zmz&age=29`,
			type: 'POST',
			timeout: 0,
			data: {
				skill: `fullstackengineer`
			},
			success: val => {
				console.log(val)
			},
			error: val => {
				console.log(val, " ERORR")
			}
		})
		$.ajax({
			url: `api/rr?name=zmz&age=30`,
			timeout: 600000,
			async: true,
			success: val => {
				console.log(val, 'RR')
			},
			error: val => {
				console.log(val, " RR ERORR")
			}
		})
	}
	componentDidMount() {
		socket = io("http://localhost:8081");
		socket.on("soc", data => {
			console.log(data, "soc give you a message, and her's id")
		})
		socket.emit("setSoc", '')
		socket.on("progress", data => {
			let { type, msg } = data;
			let index = typeList.findIndex(item => item === type);
			index = index === -1 ? 0 : index;
			this.makeLogs(index)(msg)
		})
	}
	componentDidUpdate() {
	}

	makeLogs = index => data => {
		let { infos } = this.state;
		let obj = { ...infos[index], list: [...infos[index].list, data] };

		infos = [...infos.slice(0, index), obj, ...infos.slice(index + 1)];
		this.setState({
			infos,
		})
	}
	autohome = () => {
		$.ajax({
			url: "/api/autohomepacong",
			type: "POST",
			data: {},
			success: function (val) {
				console.log(val, ` ~~~~~~~~~~autohome`)
			}
		})
	}
	renderInfos = () => {

		let { infos = []} = this.state;
		function core(list) {
			return list.map((item, index) => {
				return <p key={index}>{item}</p>
			})
		}
		return infos.map((item, index) => {
			let { list, title, klass } = item;
			let _klass = `inforoll ${klass}`
			return (
				<div className={_klass} key={index}>
					<h2>{title}</h2>
					<div>{core(list)}</div>
				</div>
			)
		})
	}
	render() {
		return (
			<div>
				<button onClick={this.testExtend}>test extends</button>
				<button onClick={this.autohome}>autohome</button>
				<div className="infoCtn">
					{this.renderInfos()}
				</div>
			</div>
		)
	}
}