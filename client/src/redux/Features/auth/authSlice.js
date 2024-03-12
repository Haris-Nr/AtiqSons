import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";

const initialState = {
    signupData: {},
    loginData:{},
    resetData:{},
    logoutData:{},
    response:{},
};

export const signupUser = createAsyncThunk( "user/signup", async (userdata, thunkAPI) => {
        try {
            return await authApi.signup(userdata);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const loginUser = createAsyncThunk( "user/login", async (userdata, thunkAPI) => {
        try {
            return await authApi.login(userdata);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);
export const resetUserPassword = createAsyncThunk( "user/resetPassword", async (userdata, thunkAPI) => {
    try {
        return await authApi.resetPassword(userdata);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
}
);

export const logoutUser = createAsyncThunk( "user/logout", async (userId,thunkAPI) => {
    try {
        return await authApi.logout(userId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
}
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetSignupState: (state) => {
            state.signupData = {};
        },
        resetLoginState: (state) => {
            state.loginData = {};
        },
        resetPasswordState: (state) => {
            state.resetData = {};
        },
        resetLogoutState: (state) => {
            state.logoutData = {};
        },

    },
    extraReducers: (builder) => {
        builder
        //signup
            .addCase(signupUser.fulfilled, (state, action) => {
                state.signupData = action.payload;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.signupData = action.payload;
            })
             //login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loginData = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginData = action.payload;
            })
             //resetPassword
            .addCase(resetUserPassword.fulfilled, (state, action) => {
                state.resetData = action.payload;
            })
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.resetData = action.payload;
            })
             //logout
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.logoutData = action.payload;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.logoutData = action.payload;
            })
    },
});

export const { resetSignupState,resetLoginState,resetPasswordState,resetLogoutState } = authSlice.actions;
export default authSlice.reducer;
