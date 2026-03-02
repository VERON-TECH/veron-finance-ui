import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));
let menu;
let title;
if (user?.role.includes("ROLE_ADMIN")) {
  menu = "administration"
  title = "Entreprise"
} if (user?.role.includes("ROLE_RESPONSABLE_RH")) {
  menu = "personal"
  title = "Personnels"
}

const identifierSlice = createSlice({
  name: "identifier",
  initialState: { menu: menu, title: title, customer: {}, print: "", duplicata: false },
  reducers: {
    updateMenu(state, action) {
      state.menu = action.payload.menu;
    },
    updateTitle(state, action) {
      state.title = action.payload
    },

    updateCustomer(state, action) {
      state.customer = action.payload.customer
    },
    updatePrint(state, action) {
      state.print = action.payload.print
    },

    updateDuplicata(state, action) {
      state.duplicata = action.payload.duplicata
    },


  }
})

export const identifierMenuActions = identifierSlice.actions;
export default identifierSlice.reducer;