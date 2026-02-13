import { createSlice } from "@reduxjs/toolkit";

const printSlice = createSlice({
    name: "print",
    initialState: {},
    reducers: {
        getPrint(state, action) {
            state = action.payload
            return state
        }
    }

})

export const printActions = printSlice.actions;
export default printSlice.reducer