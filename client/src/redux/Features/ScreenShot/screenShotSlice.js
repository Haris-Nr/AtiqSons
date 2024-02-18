import screenShotApi from "../../api/screenShotApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    screenShots: [],
    loading: false,
    error: null,
};

export const createScreenShot = createAsyncThunk(
    "screenShot/createScreenShot",
    async ({ data, onSuccess, onFail }, { rejectWithValue }) => {
        try {
            const response = await screenShotApi.createScreenShot(
                data,
                onSuccess,
                onFail
            );
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAllScreenShots = createAsyncThunk(
    "screenShot/getAllScreenShots",
    async ({ page, limit, search }, { rejectWithValue }) => {
        try {
            const response = await screenShotApi.getAllScreenShots(
                page,
                limit,
                search
            );
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteScreenShot = createAsyncThunk(
    "screenShot/deleteScreenShot",
    async ({ id, onSuccess, onFail }, { rejectWithValue }) => {
        try {
            const response = await screenShotApi.deleteScreenShot(
                id,
                onSuccess,
                onFail
            );
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const screenShotSlice = createSlice({
    name: "screenShot",
    initialState,
    reducers: {
        resetScreenShot: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createScreenShot.pending, (state) => {
                state.loading = true;
            })
            .addCase(createScreenShot.fulfilledpending, (state) => {
                state.loading = false;
            })
            .addCase(createScreenShot.rejectedpending, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllScreenShots.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllScreenShots.fulfilledpending, (state, action) => {
                state.loading = false;
                state.screenShots = action.payload;
            })
            .addCase(getAllScreenShots.rejectedpending, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteScreenShot.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteScreenShot.fulfilledpending, (state) => {
                state.loading = false;
            })
            .addCase(deleteScreenShot.rejectedpending, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetScreenShot } = screenShotSlice.actions;

export default screenShotSlice.reducer;
