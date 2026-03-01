import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  selected: string;
  counts: Record<string, number>;
}

const initialState: CategoryState = {
  selected: "all",
  counts: {},
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.selected = action.payload;
    },
    setCounts(state, action: PayloadAction<Record<string, number>>) {
      state.counts = action.payload;
    },
  },
});

export const { setCategory, setCounts } = categorySlice.actions;
export default categorySlice.reducer;
