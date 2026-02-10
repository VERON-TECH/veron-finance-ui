import { createSlice } from "@reduxjs/toolkit";

const cashSlice = createSlice({
    name: "cash",
    initialState: "",
    reducers: {
        getCash(state, action) {
            state = action.payload
            return state

        }
    }
})


export const cashActions = cashSlice.actions;
export default cashSlice.reducer