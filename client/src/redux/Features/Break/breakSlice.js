import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import breakApi from '../../api/breakApi';


const initialState = {
    breaks: [],
    leaves: [],
    loading: false,
    error: null,
};

export const getBreaks = createAsyncThunk(
    'breaks/getBreaks',
    async ({ page, pageSize, search }) => {
        const response = await breakApi.getBreaks(page, pageSize, search);
        return response.data;
    }
);


export const getLeaves = createAsyncThunk(
    'breaks/getLeaves',
    async ({ page, pageSize, search }) => {
        const response = await breakApi.getLeaves(page, pageSize, search);
        return response.data;
    }
);

export const createBreak = createAsyncThunk(
    'breaks/createBreak',
    async ({
        startTime, 
        endTime, 
        isLeave,
        onSucess,
        onFail, 
    }) => {
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
    'breaks/approveLeave',
    async ({ id, onSuccess, onFail }) => {
        const response = await breakApi.approveLeave(id, onSuccess, onFail);
        return response.data;
    }
);


export const rejectLeave = createAsyncThunk(
    'breaks/rejectLeave',
    async ({ id, onSuccess, onFail }) => {
        const response = await breakApi.rejectLeave(id, onSuccess, onFail);
        return response.data;
    }
);

const breakSlice = createSlice({
    name: 'breaks',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        //get break
        [getBreaks.pending]: (state) => {
            state.loading = true;
        },
        [getBreaks.fulfilled]: (state, action) => {
            state.loading = false;
            state.breaks = action.payload;
        },
        [getBreaks.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        // get leave
        [getLeaves.pending]: (state) => {
            state.loading = true;
        },
        [getLeaves.fulfilled]: (state, action) => {
            state.loading = false;
            state.leaves = action.payload;
        },
        [getLeaves.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },

        // createBreak
        [createBreak.pending]: (state) => {
            state.loading = true;
        },
        [createBreak.fulfilled]: (state, action) => {
            state.loading = false;
            state.breaks.push(action.payload);
        },
        [createBreak.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        // approve leave
        [approveLeave.pending]: (state) => {
            state.loading = true;
        },
        [approveLeave.fulfilled]: (state, action) => {
            state.loading = false;
            state.leaves = state.leaves.map((leave) => {
                if (leave._id === action.payload._id) {
                    return action.payload;
                }
                return leave;
            });
        },
        [approveLeave.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        // reject leave
        [rejectLeave.pending]: (state) => {
            state.loading = true;
        },
        [rejectLeave.fulfilled]: (state, action) => {
            state.loading = false;
            state.leaves = state.leaves.map((leave) => {
                if (leave._id === action.payload._id) {
                    return action.payload;
                }
                return leave;
            });
        },
        [rejectLeave.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        },
        
    },
});

export default breakSlice.reducer;