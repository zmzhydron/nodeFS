import $ from "jquery"
var ActionWrapper = type => value =>{
	return {
		type: type,
		value: value
	}
}
export const test = ActionWrapper("TEST");
export const requestRoot = obj => dispatch => {
	return $.ajax({
		url: "/api/getFiles",
		type: 'POST',
		data: obj,
		success: function(res){
			console.log(res);
			dispatch({
				type: "ADD_ROOTPATH",
				value: res
			})
		}
	})
}

