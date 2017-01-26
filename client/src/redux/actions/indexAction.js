import $ from "jquery"
var ActionWrapper = type => value =>{
	return {
		type: type,
		value: value
	}
}
export const test = ActionWrapper("TEST");
export const requestRoot = obj => dispatch => {
	console.log(obj);
	return $.ajax({
		url: "/api/suckyou",
		success: function(res){
			console.log(res, "************")
			dispatch({
				type: "ADD_ROOTPATH",
				value: res
			})
		}
	})
}
