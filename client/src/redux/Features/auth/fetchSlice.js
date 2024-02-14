import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";


const initialState = {
    user: {},
    error:{},
};

export const fetchUser = createAsyncThunk("user/fetch", async (_, thunkAPI) => {
    try {
        return await authApi.currentUser();
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const fetchSlice = createSlice({
    name: "fetch",
    initialState,
    reducers: {
        resetFetchState: (state) => {
            state.user = {};
            state.error = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});
export const { resetFetchState } = fetchSlice.actions;
export default fetchSlice.reducer;