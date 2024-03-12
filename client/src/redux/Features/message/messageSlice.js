import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
    name: "responseMessage",
    initialState: {
        message: "",
        type: null, // 'success' or 'error'
    },
    reducers: {
        showMessage: (state, action) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        clearMessage: (state) => {
            state.message = "";
            state.type = null;
        },
    },
});

export const { showMessage, clearMessage } =
messageSlice.actions;

export default messageSlice.reducer;