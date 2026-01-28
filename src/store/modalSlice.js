import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: { control: "", value: "", close: false },
  reducers: {
    update(state, action) {
      state.control = action.payload
    },
    updateValue(state, action) {
      state.value = action.payload
    },
    updateClose(state) {
      state.close = !state.close
    }
  }
})

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;