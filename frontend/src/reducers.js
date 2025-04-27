import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./redux/reducers/userReducer"

export default combineReducers({
   user: userReducer
})