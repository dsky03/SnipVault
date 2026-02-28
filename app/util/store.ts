import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import categoryReducer from "./categorySlice";
import searchReducer from "./searchSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    category: categoryReducer,
    search: searchReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
