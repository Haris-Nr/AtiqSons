import axiosInstance from './axiosInstance';

const addProduct = async (productData) => {
    try {
        const response = await axiosInstance.post(`/api/product/addproduct`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data
    }
};

const fetchProductsbyemployee = async (productData,page,limit,search) => {
    try {
        const queryParams = `?page=${page}&limit=${limit}&search=${search}`;
        const response = await axiosInstance.post(`/api/product/fetchProductsbyemployee${queryParams}`, { createdBy: productData });
        return response.data;
    } catch (error) {
        throw error.response.data
    }
};

const getSingleProduct = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/product/fetchSingleProduct/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }

};

const getAllProduct = async (page, limit, search) => {
    try {
        const response = await axiosInstance.get(`/api/product/fetchallProduct?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/product/deleteproduct/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const updateProduct = async (id) => {
    try {
        const response = await axiosInstance.patch(`/api/product/updateProduct/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const changeProductStatus = async (id, newStatus) => {
    try {
        const response = await axiosInstance.patch(`/api/product/changeProductStatus/${id}`, { status: newStatus });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const getTrackProduct = async (data) => {
    try {
        const response = await axiosInstance.post(`/api/product/trackProduct`,data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const changeTrackStatus = async (id, newStatus) => {
    try {
        const response = await axiosInstance.patch(`/api/product/changeTrackStatus/${id}`, { tracking: newStatus });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const getIntrackingProduct = async (productData) => {
    try {
        const {data} = await axiosInstance.post(`/api/product/intrackingProduct`,{ createdBy: productData });
        return data;
    } catch (error) {
        throw error.response.data;
    }
    
};

const dubaiProduct = async () => {
    try {
        const response = await axiosInstance.get(`/api/product/dubaiproduct`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};




const productApi = {
    addProduct,
    fetchProductsbyemployee,
    getSingleProduct,
    getAllProduct,
    deleteProduct,
    changeProductStatus,
    updateProduct,
    getTrackProduct,
    changeTrackStatus,
    getIntrackingProduct,
    dubaiProduct
};

export default productApi;