import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { username: "", role: [] },
  reducers: {
    login(state, action) {
      state.username = action.payload.username;
      state.role = action.payload.role;
    },

    logout(state) {
      state.username = "";
      state.role.forEach(r => r.shift());

    }

  }
})

export const authActions = authSlice.actions;
export default authSlice.reducer;
