import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
  },
  reducers: {
    // Actions
    setAuthUser: (state, action) => {
      state.user = action.payload; // Update the user in the state
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
  },
});

export const { setAuthUser, setSuggestedUsers } = authSlice.actions;
export default authSlice.reducer; // Export the reducer, not the entire slice
