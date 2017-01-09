import { combineReducers } from 'redux'
import indexReducer from "./indexReducer.js"
export default combineReducers({
	index: indexReducer
},{})