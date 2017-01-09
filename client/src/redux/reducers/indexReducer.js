
let initialState = {
	me: "not work properly"
}

var reducerGenerator = obj => (state = initialState, action) => {
	let { type } = action;
	if(obj[type] && typeof obj[type] === 'function'){
		return obj[type](state,action);
	}else{
		return state;
	}
}

var indexReducer = reducerGenerator({
	TEST: (state, action) =>{
		let { value } = action;
		return Object.assign({}, state, {
			me: value+" hehe"
		})
	}
})

export default indexReducer;