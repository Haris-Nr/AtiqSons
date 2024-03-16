import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";

const initialState = {
    resMessage: {},
};

export const signupUser = createAsyncThunk(
    "user/signup",
    async (userdata, thunkAPI) => {
        try {
            return await authApi.signup(userdata);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const loginUser = createAsyncThunk(
    "user/login",
    async (userdata, thunkAPI) => {
        try {
            return await authApi.login(userdata);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const resetUserPassword = createAsyncThunk(
    "user/resetPassword",
    async (userdata, thunkAPI) => {
        try {
            return await authApi.resetPassword(userdata);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "user/logout",
    async (userId, thunkAPI) => {
        try {
            return await authApi.logout(userId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetresMessageState: (state) => {
            state.resMessage = {};
        },
    },
    extraReducers: (builder) => {
        builder
            //signup
            .addCase(signupUser.fulfilled, (state, action) => {
                state.resMessage = action.payload;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.resMessage = action.payload;
            })
            //login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.resMessage = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.resMessage = action.payload;
            })
            //resetPassword
            .addCase(resetUserPassword.fulfilled, (state, action) => {
                state.resMessage = action.payload;
            })
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.resMessage = action.payload;
            })
            //logout
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.resMessage = action.payload;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.resMessage = action.payload;
            });
    },
});

export const { resetresMessageState } = authSlice.actions;
export default authSlice.reducer;
