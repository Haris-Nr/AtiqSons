import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import inventoryapi from "../../api/stockapi";

const initialState = {
    addstockmessage: {},
    stockItems: [],
    isLoading: false,
    error: {},
    uploadMessage: {},
    pagination: { page: 1, limit: 10, totalPages: 0, totalItems: 0 },
};

export const addStock = createAsyncThunk(
    "inventory/addStock",
    async (stockdata, thunkAPI) => {
        try {
            const response = await inventoryapi.addStock(stockdata);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getStock = createAsyncThunk(
    "inventory/getStock",
    async ({ search = "", page = 1, limit = 10 }, thunkAPI) => {
        try {
            const response = await inventoryapi.getStock(search, page, limit);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const uploadStock = createAsyncThunk(
    "inventory/uploadStock",
    async (file, thunkAPI) => {
        try {
            const response = await inventoryapi.uploadStock(file);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteStock = createAsyncThunk(
    "inventory/deleteStock",
    async (id, thunkAPI) => {
        try {
            const response = await inventoryapi.deleteStock(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const editStock = createAsyncThunk(
    "inventory/editStock",
    async ({ id, stockData }, thunkAPI) => {
        try {
            const response = await inventoryapi.editStock(id, stockData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const inventorySlice = createSlice({
    name: "stock",
    initialState,
    reducers: {
        resetStockState: (state) => {
            state.addstockmessage = {};
            state.uploadMessage = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // add stock
            .addCase(addStock.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addstockmessage = action.payload;
            })
            .addCase(addStock.rejected, (state, action) => {
                state.isLoading = false;
                state.addstockmessage = action.payload;
            })
            // get stock
            .addCase(getStock.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stockItems = action.payload.data;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    totalPages: action.payload.totalPages,
                    totalItems: action.payload.totalItems,
                };
            })
            .addCase(getStock.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // upload file
            .addCase(uploadStock.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.uploadMessage = action.payload;
            })
            .addCase(uploadStock.rejected, (state, action) => {
                state.isLoading = false;
                state.uploadMessage = action.payload;
            })
            // delete stock
            .addCase(deleteStock.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addstockmessage = action.payload;
            })
            .addCase(deleteStock.rejected, (state, action) => {
                state.isLoading = false;
                state.addstockmessage = action.payload;
            })
            // Edit stock
            .addCase(editStock.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addstockmessage = action.payload;
            })
            .addCase(editStock.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetStockState } = inventorySlice.actions;

export default inventorySlice.reducer;
