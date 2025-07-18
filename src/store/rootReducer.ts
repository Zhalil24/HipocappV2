import { combineReducers } from '@reduxjs/toolkit';
import entryReducer from './slices/entrySlice';
import randomEntryReducer from './slices/randomEntrySlice';
import loginReducer from './slices/loginSlice';
import titleListReducer from "./slices/titleListSlice";
import titleEntryReducer from "./slices/titleEntrySlice"; 


const rootReducer = combineReducers({
  entries: entryReducer,
  randomEntries: randomEntryReducer,
  login: loginReducer,
  titleList: titleListReducer,
  titleEntry: titleEntryReducer,

});

export default rootReducer;