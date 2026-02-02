import { configureStore } from "@reduxjs/toolkit";
import noteSlice from "./noteSlice"
import authSlice from "./authSlice";
import modalSlice from "./modalSlice";
import identifierSlice from "./identifierSlice";
import dataTableSlice from "./dataTableSlice"
import authorizeSlice from "./authorizeSlice"

const store = configureStore({
  reducer: {
    note: noteSlice,
    auth: authSlice,
    modal: modalSlice,
    identifier: identifierSlice,
    stateTable: dataTableSlice,
    authorize: authorizeSlice
  }
})

export default store;