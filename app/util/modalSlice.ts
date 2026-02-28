import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface modalState {
  createSnippetModal: boolean;
  updateSnippetModal: boolean;
  updateSnippetId: string;
}

const initialState: modalState = {
  createSnippetModal: false,
  updateSnippetModal: false,
  updateSnippetId: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setCreateSnippetModal: (state, action: PayloadAction<boolean>) => {
      state.createSnippetModal = action.payload;
    },
    setUpdateSnippetModal: (
      state,
      action: PayloadAction<{ open: boolean; snippetId: string }>,
    ) => {
      state.updateSnippetModal = action.payload.open;
      state.updateSnippetId = action.payload.snippetId;
    },
  },
});

export const { setCreateSnippetModal, setUpdateSnippetModal } =
  modalSlice.actions;
export default modalSlice.reducer;
