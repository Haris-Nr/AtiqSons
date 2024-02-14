import axiosInstance from './axiosInstance';

const addDubaiProduct = async (productData) => {
    try {
        const response = await axiosInstance.post(`/api/dubai/adddubaiproduct`, productData,);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
};

const allProduct = async () => {
    try {
        const response = await axiosInstance.get(`/api/dubai/allproduct`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
};

const dubaiApi = {
    addDubaiProduct,
    allProduct
};

export default dubaiApi;