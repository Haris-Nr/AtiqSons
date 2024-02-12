import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dubaiApi from "../../api/dubaiApi";

const initialState = {
    addDubaiProductData: {},
    AllProductData: [],
    isLoading: false,
    error:{}
};

export const createDubaiProduct = createAsyncThunk(
    "dubai/addProduct",
    async (dubaiproductData, thunkAPI) => {
        try {
            const response = await dubaiApi.addDubaiProduct(dubaiproductData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const AllProduct = createAsyncThunk(
    "dubai/allproduct",
    async (id, thunkAPI) => {
        try {
            const response = await dubaiApi.allProduct(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const dubaiSlice = createSlice({
    name: "dubai",
    initialState,
    reducers: {
        resetDubaiProductState: (state) => {
            state.addDubaiProductData = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // add dubai product
            .addCase(createDubaiProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createDubaiProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addDubaiProductData = action.payload;
            })
            .addCase(createDubaiProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.addDubaiProductData = action.payload;
            })
            // all products
            .addCase(AllProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AllProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.AllProductData = action.payload;
            })
            .addCase(AllProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export const {
    resetDubaiProductState,
} = dubaiSlice.actions;
export default dubaiSlice.reducer;
