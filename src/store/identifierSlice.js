import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));
let menu;
let title;
if (user?.role.includes("ROLE_ADMIN")) {
  menu = "administration"
  title = "Entreprise"
}

const identifierSlice = createSlice({
  name: "identifier",
  initialState: { menu: menu, title: title },
  reducers: {
    updateMenu(state, action) {
      state.menu = action.payload.menu;
    },
    updateTitle(state, action) {
      state.title = action.payload
    }

  }
})

export const identifierMenuActions = identifierSlice.actions;
export default identifierSlice.reducer;