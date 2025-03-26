// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Define initial state for authentication
const initialState = {
  user: null,
  isAuthenticated: false,
};

// Create the authSlice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set the authenticated user
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Log out the user and reset authentication
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
    // Set the login status after successful login
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

// Export actions
export const { setUser, logout, loginSuccess} = authSlice.actions;

// Export reducer
export default authSlice.reducer;


