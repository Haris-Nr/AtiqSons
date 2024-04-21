import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import employeeApi from "../../api/employeeApi";

const initialState = {
    getEmployeedata: {},
    isLoading: false,
};

export const getEmployee = createAsyncThunk(
    "user/getemployee",
    async ({page,limit}, { rejectWithValue }) => {
        try {
            return await employeeApi.getEmployee(page, limit);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAdmin = createAsyncThunk(
    "user/getAdmin",
    async ({page,limit}, { rejectWithValue }) => {
        try {
            return await employeeApi.getAdmin(page,limit);
            
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    "user/delete",
    async (id, thunkAPI) => {
        try {
            return await employeeApi.deleteEmployee(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const changeUserStatus = createAsyncThunk(
    "user/changeStatus",
    async ({ id, newStatus }, thunkAPI) => {
        try {
            return await employeeApi.changeStatus(id, newStatus);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getEmployeeDetails = createAsyncThunk(
    "user/getEmployeeDetails",
    async (id, thunkAPI) => {
        try {
            const response = await employeeApi.getEmployeeDetails(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getEmployeeNameAndId = createAsyncThunk(
    "user/getempnameid",
    async (_, { rejectWithValue }) => {
        try {
            return await employeeApi.getEmployeeNameAndId();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
        resetgetEmployeedataState: (state) => {
            state.getEmployeedata = {};
        },
    },
    extraReducers: (builder) => {
        builder

            // admin
            .addCase(getAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getEmployeedata = action.payload;
            })
            .addCase(getAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.getEmployeedata = action.payload;
            })

            // employee
            .addCase(getEmployee.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getEmployeedata = action.payload;
            })
            .addCase(getEmployee.rejected, (state, action) => {
                state.isLoading = false;
                state.getEmployeedata = action.payload;
            })

            // deleteEmployee
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.getEmployeedata = action.payload;
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.getEmployeedata = action.payload;
            })

            // change status
            .addCase(changeUserStatus.fulfilled, (state, action) => {
                state.getEmployeedata = action.payload;
            })
            .addCase(changeUserStatus.rejected, (state, action) => {
                state.getEmployeedata = action.payload;
            })
            
            // employeeDetails
            .addCase(getEmployeeDetails.fulfilled, (state, action) => {
                state.getEmployeedata = action.payload;
            })
            .addCase(getEmployeeDetails.rejected, (state, action) => {
                state.getEmployeedata = action.payload;
            })
            // employee Name and id
            .addCase(getEmployeeNameAndId.fulfilled, (state, action) => {
                state.getEmployeedata = action.payload;
            })
            .addCase(getEmployeeNameAndId.rejected, (state, action) => {
                state.getEmployeedata = action.payload;
            })
    },
});

export const {
    resetgetEmployeedataState
} = employeeSlice.actions;
export default employeeSlice.reducer;
