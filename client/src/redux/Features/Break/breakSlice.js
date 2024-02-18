import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import breakApi from "../../api/breakApi";

const initialState = {
    breaks: [],
    leaves: [],
    loading: false,
    error: null,
};

export const getBreaks = createAsyncThunk(
    "breaks/getBreaks",
    async ({ page, pageSize, search, filter }) => {
        const response = await breakApi.getBreaks(page, pageSize, search, filter);
        return response.data;
    }
);

export const getLeaves = createAsyncThunk(
    "breaks/getLeaves",
    async ({ page, pageSize, search, filter }) => {
        const response = await breakApi.getLeaves(page, pageSize, search, filter);
        return response.data;
    }
);

export const createBreak = createAsyncThunk(
    "breaks/createBreak",
    async ({ startTime, endTime, isLeave, onSucess, onFail }) => {
        const response = await breakApi.createBreak(
            startTime,
            endTime,
            isLeave,
            onSucess,
            onFail
        );
        return response.data;
    }
);

export const approveLeave = createAsyncThunk(
    "breaks/approveLeave",
    async ({ id, onSuccess, onFail }) => {
        const response = await breakApi.approveLeave(id, onSuccess, onFail);
        return response.data;
    }
);

export const rejectLeave = createAsyncThunk(
    "breaks/rejectLeave",
    async ({ id, onSuccess, onFail }) => {
        const response = await breakApi.rejectLeave(id, onSuccess, onFail);
        return response.data;
    }
);

const breakSlice = createSlice({
    name: "breaks",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //get break
            .addCase(getBreaks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBreaks.fulfilled, (state, action) => {
                state.loading = false;
                state.breaks = action.payload;
            })
            .addCase(getBreaks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // get leave
            .addCase(getLeaves.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLeaves.fulfilled, (state, action) => {
                state.loading = false;
                state.leaves = action.payload;
            })
            .addCase(getLeaves.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // createBreak
            .addCase(createBreak.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBreak.fulfilled, (state, action) => {
                state.loading = false;
                state.breaks.push(action.payload);
            })
            .addCase(createBreak.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // approve leave
            .addCase(approveLeave.pending, (state) => {
                state.loading = true;
            })
            .addCase(approveLeave.fulfilled, (state, action) => {
                state.loading = false;
                state.leaves = state.leaves.map((leave) => {
                    if (leave._id === action.payload._id) {
                        return action.payload;
                    }
                    return leave;
                });
            })
            .addCase(approveLeave.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // reject leave
            .addCase(rejectLeave.pending, (state) => {
                state.loading = true;
            })
            .addCase(rejectLeave.fulfilled, (state, action) => {
                state.loading = false;
                state.leaves = state.leaves.map((leave) => {
                    if (leave._id === action.payload._id) {
                        return action.payload;
                    }
                    return leave;
                });
            })
            .addCase(rejectLeave.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default breakSlice.reducer;
