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
	console.log(store, "store")
	console.log(action, "action")
	next(action)
}
let one = store => next => action =>{
	console.log(1111111111,action)
	// next(action)
}
let two = store => next => action =>{
	console.log(22222222)
	next(action)
}
let middlewares = [start, one, two]
const createStoreWithMidderware = applyMiddleware(ReduxThunk, ...middlewares)(createStore);

let store = createStoreWithMidderware(reducers)

ReactDom.render(
<Provider store = {store}>
	<App />
</Provider>
,document.getElementById('app'));
