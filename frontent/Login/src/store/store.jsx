// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";  // Import authSlice reducer
import taskReducer from "./taskSlice";  // Import taskSlice reducer

// Create the Redux store and include the reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,   // Handle authentication state
    task: taskReducer,  // Handle tasks state
  },
});

