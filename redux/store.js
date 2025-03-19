"use client";

import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./roleSlice";

const store = configureStore({
  reducer: {
    role: roleReducer,
  },
});

export default store;
