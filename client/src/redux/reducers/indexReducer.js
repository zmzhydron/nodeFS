let initialState = {
	me: "not work properly",
	rootValue: "shit",
	currentPath: 'C:/Users/Administrator/Desktop',
	accidents: [],
	newCar: "GOLF GTI",
	price: "400k",
	playSrc: "",
	ext: {
		me: {
			name: "zmz"
		}
	}
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
	TESTMIDDLEWARE: (state,action) => {
		let { value } = action;
		return Object.assign({}, state, {
			newCar: value
		})
	},
	TESTMIDDLEWARETWO: (state,action) => {
		let { value } = action;
		return Object.assign({}, state, {
			price: value
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
	},
	UPDATE_ACCIDENT: (state, action) =>{
		return Object.assign({}, state, {
			accidents: action.value
		})
	},
	TEST_EXTEND: (state, action) =>{
		console.log(state.ext, " *************  ")
		return state;
	}
})

export default indexReducer;