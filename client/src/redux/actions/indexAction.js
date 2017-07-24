var ActionWrapper = type => value =>{
	return {
		type: type,
		value: value
	}
}
export const testone = ActionWrapper("TESTMIDDLEWARE")
export const testtwo = ActionWrapper("TESTMIDDLEWARETWO")
export const test = ActionWrapper("TEST");
export const changePath = ActionWrapper("CHANGE_PATH");
export const setPlaySrc = ActionWrapper("SET_PLAY_SRC");
export const testExtend = ActionWrapper("TEST_EXTEND");
export const requestRoot = obj => dispatch => {

	// return $.ajax({
	// 	url: "/api/getFiles",
	// 	type: 'POST',
	// 	data: obj,
	// 	success: function(res){
	// 		dispatch({
	// 			type: "ADD_ROOTPATH",
	// 			value: res
	// 		})
	// 	}
	// })
}

export const getAccident = obj => (dispatch,a,b,c) => {
	// console.log(obj);
	// console.log(a)
	// console.log(b);
	// console.log(c)
	// console.log("$$$$$$$$$$$$")
	// 	$.ajax({
	// 	url: "/api/readFiles",
	// 	type: 'POST',
	// 	data: { path: obj},
	// 	success: function(res){
	// 		dispatch({
	// 			type: "UPDATE_ACCIDENT",
	// 			value: res
	// 		})
	// 	}
	// })
}


