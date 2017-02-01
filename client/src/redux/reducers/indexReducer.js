let initialState = {
	me: "not work properly",
	rootValue: "shit",
	currentPath: 'C:/Users/Administrator/Desktop',
	playSrc: "",
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
	},
	ADD_ROOTPATH: (state, action) =>{
		let { value } = action;
		return Object.assign({}, state, {
			rootList: value
		})
	},
	CHANGE_PATH: (state, action) =>{
		return Object.assign({}, state, {
			currentPath: action.value
		})
	},
	SET_PLAY_SRC: (state, action) =>{
		return Object.assign({}, state, {
			playSrc: action.value
		})
	}
})

export default indexReducer;