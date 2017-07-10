import React from "react"

export default class Photowall extends React.Component{
	constructor(props){
		super();
		this.state = {
			photos: []
		}
	}
	render(){
		return (
			<div>
				<h2>photo wall!</h2>
			</div>
		)
	}
}