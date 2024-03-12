// src/features/notifications/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
    name: "responseMessage",
    initialState: {
        message: "",
        type: null, // 'success' or 'error'
    },
    reducers: {
        showSuccessMessage: (state, action) => {
            state.message = action.payload;
            state.type = "success";
        },
        showErrorMessage: (state, action) => {
            state.message = action.payload;
            state.type = "error";
        },
        clearMessage: (state) => {
            state.message = "";
            state.type = null;
        },
    },
});

export const { showSuccessMessage, showErrorMessage, clearMessage } =
messageSlice.actions;

export default messageSlice.reducer;
