import axiosInstance from './axiosInstance';

export const getExchangeRate = async (currency1, currency2) => {
    try {
        const response = await axiosInstance.get(`/api/exchange-rate/${currency1}/${currency2}`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}


export const getCurrencyOptions = async () => {
    try {
        const response = await axiosInstance.get(`/api/exchange-rate/currency-options`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}


export const getExchangeRates = async (page, pageSize, search) => {
    try {
        const response = await axiosInstance.get(`/api/exchange-rate?page=${page}&limit=${pageSize}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

export const createExchangeRate = async (values, onSuccess, onFail ) => {
    try {
        const response = await axiosInstance.post(`/api/exchange-rate`, values);
        if (response.status === 201 || response.status === 200) {
            onSuccess();
        } else {
            onFail();
        }
        return response.data;
    } catch (error) {
        onFail();
        throw error.response.data
    }
}

export const updateExchangeRate = async (id, updatedExchangeRate) => {
    try {
        const response = await axiosInstance.put(`/api/exchange-rate/${id}`, updatedExchangeRate);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

export const deleteExchangeRate = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/exchange-rate/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

const exchangeRateApi = {
    getExchangeRate,
    getExchangeRates,
    getCurrencyOptions,
    createExchangeRate,
    updateExchangeRate,
    deleteExchangeRate
}

export default exchangeRateApi;