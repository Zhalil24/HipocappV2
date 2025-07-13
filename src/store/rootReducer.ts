import { combineReducers } from '@reduxjs/toolkit';
import entryReducer from './slices/entrySlice';

const rootReducer = combineReducers({
  entries: entryReducer,
});

export default rootReducer;