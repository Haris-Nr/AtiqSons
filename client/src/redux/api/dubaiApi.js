import axiosInstance from './axiosInstance';

const addDubaiProduct = async (productData) => {
    try {
        const response = await axiosInstance.post(`/api/dubai/adddubaiproduct`, productData,);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
};

const allProduct = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/dubai/allproduct/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
};

const deleteDubaiProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/dubai/deleteproduct/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const dubaiApi = {
    addDubaiProduct,
    allProduct,
    deleteDubaiProduct
};

export default dubaiApi;