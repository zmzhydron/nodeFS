import React from 'react'
import ReactDom from "react-dom"
import App from "./src/index.jsx"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import ReduxThunk from "redux-thunk"
import reducers from "./src/redux/reducers/MainReducer.js"

const createStoreWithMidderware = applyMiddleware(ReduxThunk)(createStore);
// console.log(createStoreWithMidderware, applyMiddleware);
let store = createStoreWithMidderware(reducers)
// console.log(store);
ReactDom.render(
<Provider store = {store}>
	<App />
</Provider>
,document.getElementById('app'));
