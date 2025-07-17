import { combineReducers } from '@reduxjs/toolkit';
import entryReducer from './slices/entrySlice';
import randomEntryReducer from './slices/randomEntrySlice';
import loginReducer from './slices/loginSlice';
import titleListReducer from "./slices/titleListSlice";


const rootReducer = combineReducers({
  entries: entryReducer,
  randomEntries: randomEntryReducer,
  login: loginReducer,
  titleList: titleListReducer,
});

export default rootReducer;