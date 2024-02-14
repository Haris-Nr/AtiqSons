import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import exchangeRateApi from "../../api/exchangeRateApi";

const initialState = {
    currencyOptions: [],
    selectedCurrencyExchangeRate: {},
    exchangeRates: {},
    isLoading: false,
    errorMessage: ""
};


export const getExchangeRate = createAsyncThunk(
    "exchangeRate/getExchangeRate",
    async ({currency1, currency2}, thunkAPI) => {
        try {
            const response = await exchangeRateApi.getExchangeRate(currency1, currency2);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const getExchangeRates = createAsyncThunk(
    "exchangeRate/getExchangeRates",
    async ({ page, pageSize, search }, thunkAPI) => {
        try {
            const response = await exchangeRateApi.getExchangeRates(page, pageSize, search);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getCurrencyOptions = createAsyncThunk(
    "exchangeRate/getCurrencyOptions",
    async (thunkAPI) => {
        try {
            const response = await exchangeRateApi.getCurrencyOptions();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const createExchangeRate = createAsyncThunk(
    "exchangeRate/createExchangeRate",
    async (values, thunkAPI) => {
        try {
            const response = await exchangeRateApi.createExchangeRate(values);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const updateExchangeRate = createAsyncThunk(
    "exchangeRate/updateExchangeRate",
    async ({ id, updatedExchangeRate}, thunkAPI) => {
        try {
            const response = await exchangeRateApi.updateExchangeRate(id, updatedExchangeRate);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteExchangeRate = createAsyncThunk(
    "exchangeRate/deleteExchangeRate",
    async (id, thunkAPI) => {
        try {
            const response = await exchangeRateApi.deleteExchangeRate(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const exchangeRateSlice = createSlice({
    name: "exchangeRate",
    initialState,
    reducers: {
        resetExchangeRate: state => {
            state.exchangeRate = {};
        }
    },
    extraReducers: {
        [getExchangeRate.pending]: state => {
            state.isLoading = true;
        },
        [getExchangeRate.fulfilled]: (state, action) => {
            state.selectedCurrencyExchangeRate = action.payload;
            state.isLoading = false;
        },
        [getExchangeRate.rejected]: (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        },

        [getExchangeRates.pending]: state => {
            state.isLoading = true;
        },
        [getExchangeRates.fulfilled]: (state, action) => {
            state.exchangeRates = action.payload;
            state.isLoading = false;
        },
        [getExchangeRates.rejected]: (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        },

        [getCurrencyOptions.pending]: state => {
            state.isLoading = true;
        },
        [getCurrencyOptions.fulfilled]: (state, action) => {
            state.currencyOptions = action.payload;
            state.isLoading = false;
        },
        [getCurrencyOptions.rejected]: (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        },

        [createExchangeRate.pending]: state => {
            state.isLoading = true;
        },
        [createExchangeRate.fulfilled]: (state, action) => {
            state.exchangeRate = action.payload;
            state.isLoading = false;
        },
        [createExchangeRate.rejected]: (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        },
        [updateExchangeRate.pending]: state => {
            state.isLoading = true;
        },
        [updateExchangeRate.fulfilled]: (state, action) => {
            state.exchangeRate = action.payload;
            state.isLoading = false;
        },
        [updateExchangeRate.rejected]: (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        },
        [deleteExchangeRate.pending]: state => {
            state.isLoading = true;
        },
        [deleteExchangeRate.fulfilled]: (state, action) => {
            state.exchangeRates = action.payload;
            state.isLoading = false;
        },
        [deleteExchangeRate.rejected]: (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        }
    }
});


export const { resetExchangeRate } = exchangeRateSlice.actions;
export default exchangeRateSlice.reducer;