import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as fullfilmentService from "../../api/fullfilmentApi"; // Adjust the import path as necessary

// Create a new fullfilment
export const createFullfilment = createAsyncThunk(
    "fullfilments/create",
    async (fullfilmentData, { rejectWithValue }) => {
        try {
            const response = await fullfilmentService.createFullfilment(
                fullfilmentData
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Get all fullfilments
export const getAllFullfilments = createAsyncThunk(
    "fullfilments/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fullfilmentService.getAllFullfilments();
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Update a fullfilment
export const updateFullfilment = createAsyncThunk(
    "fullfilments/update",
    async ({ id, fullfilmentData }, { rejectWithValue }) => {
        try {
            const response = await fullfilmentService.updateFullfilment(
                id,
                fullfilmentData
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Delete a fullfilment
export const deleteFullfilment = createAsyncThunk(
    "fullfilments/delete",
    async (id, { rejectWithValue }) => {
        try {
          const response =  await fullfilmentService.deleteFullfilment(id);
            return response.data
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const fullfilmentsSlice = createSlice({
    name: "fullfilments",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle create fullfilment
            .addCase(createFullfilment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle get all fullfilments
            .addCase(getAllFullfilments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllFullfilments.fulfilled, (state, action) => {
                state.items = action.payload.fullfilments;
                state.loading = false;
            })
            .addCase(getAllFullfilments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle update fullfilment

            .addCase(updateFullfilment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle delete fullfilment

            .addCase(deleteFullfilment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default fullfilmentsSlice.reducer;
