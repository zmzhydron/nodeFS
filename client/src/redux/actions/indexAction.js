import $ from "jquery"
var ActionWrapper = type => value =>{
	return {
		type: type,
		value: value
	}
}
export const test = ActionWrapper("TEST");
export const changePath = ActionWrapper("CHANGE_PATH");
export const setPlaySrc = ActionWrapper("SET_PLAY_SRC");
export const requestRoot = obj => dispatch => {
	return $.ajax({
		url: "/api/getFiles",
		type: 'POST',
		data: obj,
		success: function(res){
			dispatch({
				type: "ADD_ROOTPATH",
				value: res
			})
		}
	})
}

export const getAccident = obj => dispatch => {
	return $.ajax({
		url: "/api/readFiles",
		type: 'POST',
		data: { path: obj},
		success: function(res){
			dispatch({
				type: "UPDATE_ACCIDENT",
				value: res
			})
		}
	})
}


