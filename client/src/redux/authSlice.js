import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    // Actions
    setAuthUser: (state, action) => {
      state.user = action.payload; // Update the user in the state
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer; // Export the reducer, not the entire slice
