import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import taskApi from "../../api/taskApi";

const initialState = {

    fetchtaskData: [],
    fetchtalltaskData: [],

    Addtaskdata: {},
    deleteTaskData: {},
    changeStatusdata: {},
    
    isLoading: false,
    error:{}
};

export const addTask = createAsyncThunk(
    "task/addtask",
    async (taskData, thunkAPI) => {
        try {
            const response = await taskApi.addTask(taskData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const TasksForEmployee = createAsyncThunk(
    "task/tasksForEmployee",
    async (_, thunkAPI) => {
        try {
            const response = await taskApi.fetchTasksForEmployee();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const TasksAllEmployee = createAsyncThunk(
    "task/tasksAllEmployee",
    async (_, thunkAPI) => {
        try {
            const response = await taskApi.fetchTasksAllEmployee();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const changeTaskStatus = createAsyncThunk(
    "task/changeStatus",
    async ({ id, newStatus }, thunkAPI) => {
        try {
            const response = await taskApi.changeStatus(id, newStatus);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteTaskbyId = createAsyncThunk(
    "task/deletetask",
    async (id, thunkAPI) => {
        try {
            const response = await taskApi.deleteTask(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const taskSlice = createSlice({
    name: "task",
    initialState: initialState,
    reducers: {
        resettaskState: (state) => {
            state.Addtaskdata = {};
        },
        resetStatusState: (state) => {
            state.changeStatusdata = {};
        },
        resetDeleteState: (state) => {
            state.deleteTaskData = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // add task
            .addCase(addTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Addtaskdata = action.payload;
            })
            .addCase(addTask.rejected, (state, action) => {
                state.isLoading = false;
                state.Addtaskdata = action.payload;
            })
            // task for employee
            .addCase(TasksForEmployee.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(TasksForEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                state.fetchtaskData = action.payload;
            })
            .addCase(TasksForEmployee.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //All Task 
            .addCase(TasksAllEmployee.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(TasksAllEmployee.fulfilled, (state, action) => {
                state.isLoading = false;
                state.fetchtalltaskData = action.payload;
            })
            .addCase(TasksAllEmployee.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //change status
            .addCase(changeTaskStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changeTaskStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.changeStatusdata = action.payload;
            })
            .addCase(changeTaskStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.changeStatusdata = action.error;
            })
            // delete task
            .addCase(deleteTaskbyId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTaskbyId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.deleteTaskData = action.payload;
            })
            .addCase(deleteTaskbyId.rejected, (state, action) => {
                state.isLoading = false;
                state.deleteTaskData = action.payload;
            })
    },
});

export const { resettaskState, resetStatusState, resetDeleteState } = taskSlice.actions;
export default taskSlice.reducer;
