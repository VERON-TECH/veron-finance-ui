import { createSlice } from "@reduxjs/toolkit";

const noteSlice = createSlice({
  name: "note",
  initialState: { visible: "hidden", error: false, relaunch: false, dataItem: [] },
  reducers: {
    show(state) {
      state.visible = "absolute";
    },

    hide(state) {
      state.visible = "hidden";
    },

    error(state, action) {
      state.error = action.payload;
    },

    relaunch(state) {
      state.relaunch = !state.relaunch;
    },

    sendData(state, action) {
      state.dataItem = action.payload;
    }

  }
})

export const noteActions = noteSlice.actions;
export default noteSlice.reducer;