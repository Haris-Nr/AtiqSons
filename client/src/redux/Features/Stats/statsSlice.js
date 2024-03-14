import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statsApi from "../../api/statsApi";

const initialState = {
    statsData: {},
    loading: false,
    error: null,
};


export const getAllStats = createAsyncThunk(
    "stats/",
    async (timeFrame, { rejectWithValue }) => {
        try {
            const response = await statsApi.getAllStats(
                timeFrame
            );
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {},
    extraReducers:(builder) => {
        builder
            .addCase(getAllStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllStats.fulfilled, (state, action) => {
                state.loading = false;
                state.statsData = action.payload;
            })
            .addCase(getAllStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});


export default statsSlice.reducer;