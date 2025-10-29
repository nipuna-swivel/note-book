"use client";
import { configureStore } from "@reduxjs/toolkit";
import notebookReducer from "./notebookSlice";
import pageReducer from "./pageSlice";

export const store = configureStore({
  reducer: {
    notebooks: notebookReducer,
    pages: pageReducer,
  },
});

// ✅ Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


