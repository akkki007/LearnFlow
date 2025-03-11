"use client"
import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: { isTeacher: false },
  reducers: {
    toggleRole: (state) => {
      state.isTeacher = !state.isTeacher;
    },
  },
});

export const { toggleRole } = roleSlice.actions;
export default roleSlice.reducer;
