import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import importUserReducer from "./slices/importUserSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    importUsers: importUserReducer,
  },
});

export default store;