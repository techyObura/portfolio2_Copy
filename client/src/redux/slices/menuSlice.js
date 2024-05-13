import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menu: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.menu = state.menu === true ? false : true;
      if (window.location.reload()) {
        state.menu = false;
      }
    },
  },
});

export const { toggleMenu } = menuSlice.actions;

export default menuSlice.reducer;
