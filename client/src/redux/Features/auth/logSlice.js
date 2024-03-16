import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";

const initialState = {
    isLoading: false,
    logsRes: {},
};

export const allLogs = createAsyncThunk(
    "user/logs",
    async ({currentPage, pageSize}, {rejectWithValue }) => {
        try {
            return await authApi.getAllLogs(currentPage, pageSize);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const logSlice = createSlice({
    name: "logs",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            // show logs
            .addCase(allLogs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(allLogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logsRes = action.payload
            })
            .addCase(allLogs.rejected, (state, action) => {
                state.isLoading = false;
                state.logsRes = action.payload;
            })
    },
});

export default logSlice.reducer;
