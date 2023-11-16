import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducers/appReducer';
import modelReducer from './reducers/modelReducer';


export default configureStore({
  reducer: {
    app: appReducer,
    model: modelReducer
  },
});
