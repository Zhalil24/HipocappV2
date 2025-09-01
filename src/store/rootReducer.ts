import { combineReducers } from '@reduxjs/toolkit';
import entryReducer from './slices/entrySlice';
import randomEntryReducer from './slices/randomEntrySlice';
import loginReducer from './slices/loginSlice';
import titleListReducer from "./slices/titleListSlice";
import titleEntryReducer from "./slices/titleEntrySlice"; 
import registerReducer from './slices/registerSlice';
import profileReducer from './slices/profileSlice';
import contentReducer from './slices/contentSlice';
import chatReducer from './slices/chatSlice';
import forgotPasswordSlice from './slices/forgotPasswordSlice';
import adminSlice from './slices/adminSlice';


const rootReducer = combineReducers({
  entries: entryReducer,
  randomEntries: randomEntryReducer,
  login: loginReducer,
  titleList: titleListReducer,
  titleEntry: titleEntryReducer,
  register: registerReducer,
  profile: profileReducer,
  content: contentReducer,
  chat: chatReducer,
  forgotPassword: forgotPasswordSlice,
  admin: adminSlice
});

export default rootReducer;