import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'
import titleListReducer from './slices/titleListSlice';
import titleEntryReducer from "./slices/titleEntrySlice";



const store = configureStore({
  reducer: rootReducer,
  titleList: titleListReducer,
  titleEntry: titleEntryReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;