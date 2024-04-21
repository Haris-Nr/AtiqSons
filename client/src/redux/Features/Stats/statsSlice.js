import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statsApi from "../../api/statsApi";

const initialState = {
    statsData: {},
    empTaskData: [],
    error: null,
};


export const getAllStats = createAsyncThunk(
    "stats/",
    async (timeFrame, { rejectWithValue }) => {
        try {
            return await statsApi.getAllStats(
                timeFrame
            );
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAllCompletedDailyTasksWithEmployeeDetails = createAsyncThunk(
    "stats/completed-tasks",
    async (_, { rejectWithValue }) => {
        try {
            return await statsApi.getAllCompletedDailyTasksWithEmployeeDetails();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllStats.fulfilled, (state, action) => {
                state.statsData = action.payload;
            })
            .addCase(getAllStats.rejected, (state, action) => {
                state.error = action.payload;
            })
            // all completed task by employees
            .addCase(getAllCompletedDailyTasksWithEmployeeDetails.fulfilled, (state, action) => {
                state.empTaskData = action.payload;
            })
            .addCase(getAllCompletedDailyTasksWithEmployeeDetails.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});


export default statsSlice.reducer;