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
    async ({ values, onSuccess, onFail}, thunkAPI) => {
        try {
            const response = await exchangeRateApi.createExchangeRate(values, onSuccess, onFail);
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
    reducers: {},
    extraReducers: (builder) => {
        builder
        // getExchangeRate
        .addCase(getExchangeRate.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getExchangeRate.fulfilled, (state, action) => {
            state.selectedCurrencyExchangeRate = action.payload;
            state.isLoading = false;
        })
        .addCase(getExchangeRate.rejected, (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        })
        // getExchangeRatesssssss
        .addCase(getExchangeRates.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getExchangeRates.fulfilled, (state, action) => {
            state.exchangeRates = action.payload;
            state.isLoading = false;
        })
        .addCase(getExchangeRates.rejected, (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        })

        //  getCurrencyOptions
        .addCase(getCurrencyOptions.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getCurrencyOptions.fulfilled, (state, action) => {
            state.currencyOptions = action.payload;
            state.isLoading = false;
        })
        .addCase(getCurrencyOptions.rejected, (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        })

        //  createExchangeRate
        .addCase(createExchangeRate.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createExchangeRate.fulfilled, (state) => {
            state.isLoading = false;
        })
        .addCase(createExchangeRate.rejected, (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        })

        // updateExchangeRate
        .addCase(updateExchangeRate.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateExchangeRate.fulfilled, (state) => {
            state.isLoading = false;
        })
        .addCase(updateExchangeRate.rejected, (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        })

        // deleteExchangeRate
        .addCase(deleteExchangeRate.pending, state => {
            state.isLoading = true;
        })
        .addCase(deleteExchangeRate.fulfilled, (state, action) => {
            state.exchangeRates = action.payload;
            state.isLoading = false;
        })
        .addCase(deleteExchangeRate.rejected, (state, action) => {
            state.errorMessage = action.payload.message;
            state.isLoading = false;
        })
    }
});


export const { resetExchangeRate } = exchangeRateSlice.actions;
export default exchangeRateSlice.reducer;