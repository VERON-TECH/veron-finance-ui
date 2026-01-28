import { configureStore } from "@reduxjs/toolkit";
import noteSlice from "./noteSlice"
import authSlice from "./authSlice";
import modalSlice from "./modalSlice";
import identifierSlice from "./identifierSlice";

const store = configureStore({
  reducer: {
    note: noteSlice,
    auth: authSlice,
    modal: modalSlice,
    identifier: identifierSlice
  }
})

export default store;