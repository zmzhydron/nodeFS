import React from 'react'
import ReactDom from "react-dom"
import App from "./src/index.jsx"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import ReduxThunk from "redux-thunk"
import reducers from "./src/redux/reducers/MainReducer.js"
import * as css from "./src/css/index.scss"
// require("css/index.scss")

let start = store => next => action =>{
	let { type, value } = action;
	if(type === 'TESTMIDDLEWARE'){
		action.value = "AMG GT";
		console.log(store.getState().index.price, "1")
	}
	next(action)
}
let one = store => next => action =>{
	let { type, value } = action;
	if(type === 'TESTMIDDLEWARE'){
		action.value += ' S'
		console.log(store.getState().index.price, "2")
	}
	next(action)
}
let two = store => next => action =>{
	let { type, value } = action;
	if(type === 'TESTMIDDLEWARE'){
		action.value += ' S'
		console.log(store.getState().index.price, "3")
		store.dispatch({
			type: "TESTMIDDLEWARETWO",
			value: "1M"
		})
	}
	next(action)
}
let middlewares = [start, one, two];
const createStoreWithMidderware = applyMiddleware(ReduxThunk, ...middlewares)(createStore);

let store = createStoreWithMidderware(reducers)

ReactDom.render(
<Provider store = {store}>
	<App />
</Provider>
,document.getElementById('app'));
