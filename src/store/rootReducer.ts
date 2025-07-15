import { combineReducers } from '@reduxjs/toolkit';
import entryReducer from './slices/entrySlice';
import randomEntryReducer from './slices/randomEntrySlice';
import loginReducer from './slices/loginSlice';


const rootReducer = combineReducers({
  entries: entryReducer,
  randomEntries: randomEntryReducer,
  login: loginReducer,
});

export default rootReducer;