import { combineReducers } from '@reduxjs/toolkit';
import entryReducer from './slices/entrySlice';
import randomEntryReducer from './slices/randomEntrySlice';

const rootReducer = combineReducers({
  entries: entryReducer,
  randomEntries: randomEntryReducer,
});

export default rootReducer;