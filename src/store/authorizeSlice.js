import { createSlice } from "@reduxjs/toolkit";

const authorizeSlice = createSlice({
    name: "authorize",
    initialState: "",
    reducers: {
        changeAuthorize(state, action) {
            state = action.payload
            return state
        }
    }
})

export const authorizeActions = authorizeSlice.actions;
export default authorizeSlice.reducer;