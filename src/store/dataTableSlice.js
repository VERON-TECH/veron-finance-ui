import { createSlice } from "@reduxjs/toolkit";

const dataTableSlice = createSlice({
    name: "state_button_table",
    initialState: { delete: false, rib: "", mobileMoneySlug: "", storePrincipalSlug: "", safeSlug: "", supplierSlug: "" },
    reducers: {
        updateDelete(state, action) {
            state.delete = action.payload.delete
        },

        getRib(state, action) {
            state.rib = action.payload.rib
        },

        getMobileMoneySlug(state, action) {
            state.mobileMoneySlug = action.payload.mobileMoneySlug
        },

        getStorePrincipalSlug(state, action) {
            state.storePrincipalSlug = action.payload.storePrincipalSlug
        },


        getSafeSlug(state, action) {
            state.safeSlug = action.payload.safeSlug
        },

        getSupplierSlug(state, action) {
            state.supplierSlug = action.payload.supplierSlug
        }


    }
})

export const dataTableActions = dataTableSlice.actions;
export default dataTableSlice.reducer;