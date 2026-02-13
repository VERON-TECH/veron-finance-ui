import { configureStore } from "@reduxjs/toolkit";
import noteSlice from "./noteSlice"
import authSlice from "./authSlice";
import modalSlice from "./modalSlice";
import identifierSlice from "./identifierSlice";
import dataTableSlice from "./dataTableSlice"
import cashSlice from "./cashSlice"
import printSlice from "./print.js"


const store = configureStore({
  reducer: {
    note: noteSlice,
    auth: authSlice,
    modal: modalSlice,
    identifier: identifierSlice,
    stateTable: dataTableSlice,
    cash: cashSlice,
    print: printSlice
  }
})

export default store;