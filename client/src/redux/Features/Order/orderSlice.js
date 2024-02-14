import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderApi from "../../api/orderApi";

const initialState = {
    orders: {},
    isLoading: false,
    errorMessage: ""
};

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async ({values, onSuccess, onFail}, thunkAPI) => {
        try {
            const response = await orderApi.createOrder(values, onSuccess, onFail);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getOrders = createAsyncThunk(
    "order/getOrders",
    async ({ page, pageSize, search }, thunkAPI) => {
        try {
            const response = await orderApi.getOrders(page, pageSize, search);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getOrder = createAsyncThunk(
    "order/getOrder",
    async (id, thunkAPI) => {
        try {
            const response = await orderApi.getOrder(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const updateOrder = createAsyncThunk(
    "order/updateOrder",
    async ({ id, orderData, onSuccess, onFail }, thunkAPI) => {
        try {
            const response = await orderApi.updateOrder(id, orderData, onSuccess, onFail);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);



export const reOrder = createAsyncThunk(
    "order/reOrder",
    async ({id, onSuccess, onFail}, thunkAPI) => {
        try {
            const response = await orderApi.reOrder(id, onSuccess, onFail);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteOrder = createAsyncThunk(
    "order/deleteOrder",
    async ({id, onSuccess, onFail}, thunkAPI) => {
        try {
            const response = await orderApi.deleteOrder(id, onSuccess, onFail);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.isLoading = false;
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // create order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createOrder.rejected, (state) => {
                state.isLoading = false;
            })
            // get orders
            .addCase(getOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.message;
            })
            // get order
            .addCase(getOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrder.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(getOrder.rejected, (state) => {
                state.isLoading = false;
            })
            // update order
            .addCase(updateOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = orders.map((order) => {
                    if (order._id === action.payload._id) {
                        return action.payload;
                    }
                    return order;
                })
            })
            .addCase(updateOrder.rejected, (state) => {
                state.isLoading = false;
            })

            // re order
            .addCase(reOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(reOrder.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(reOrder.rejected, (state) => {
                state.isLoading = false;
            })

            // delete order
            .addCase(deleteOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteOrder.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteOrder.rejected, (state) => {
                state.isLoading = false;
            });

    },
});

export const { resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;

