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

const fetchProductsBySelectItem = async (selectItem,page,limit,search, priceLow, priceHigh) => {
    try {
        const queryParams = `?page=${page}&limit=${limit}&search=${search}&priceLow=${priceLow}&priceHigh=${priceHigh}`;
        const response = await axiosInstance.get(`/api/product/fetchProductsBySelectItem${queryParams}&selectItem=${selectItem}`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

const fetchProductsbyemployee = async ( productDataId, company ,page,limit,search, priceLow, priceHigh) => {
    try {

        const queryParams = `?page=${page}&limit=${limit}&search=${search}&priceLow=${priceLow}&priceHigh=${priceHigh}`;

        const response = await axiosInstance.post(`/api/product/fetchProductsbyemployee${queryParams}`, {
            createdBy: productDataId,
            company: company,
        });
        return response.data;
    } catch (error) {
        throw (error.response && error.response.data) ? error.response.data : error;
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

const getAllProduct = async (page, limit, search,company, priceLow, priceHigh) => {
    try {
        const response = await axiosInstance.get(`/api/product/fetchallProduct?page=${page}&limit=${limit}&search=${search}&company=${company}&priceLow=${priceLow}&priceHigh=${priceHigh}`);
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


const changeProductStatus = async (id, newStatus) => {
    try {
        const response = await axiosInstance.patch(`/api/product/changeProductStatus/${id}`, { status: newStatus });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const AddTrackProduct = async (data) => {
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

const allTrackingProduct = async (page, limit) => {
    try {
        const {data} = await axiosInstance.get(`/api/product/getIntrackingProduct?page=${page}&limit=${limit}`);
        return data;
    } catch (error) {
        throw error.response.data;
    }
}

const dubaiProduct = async (page,limit,search) => {
    try {
        const response = await axiosInstance.get(`/api/product/dubaiproduct?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const updateProduct = async (id, productData) => {
    try {
        const response = await axiosInstance.put(`/api/product/update/${id}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const deleteTrack = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/product/trackdelete/${id}`)
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const searchProducts = async (query) => {
    try {
        const encodedQuery = encodeURIComponent(query);

        console.log(encodedQuery)
        const response = await axiosInstance.get(`/api/product/search?query=${encodedQuery}`);
        console.log(response)

        // Return the response data
        return response.data;
    } catch (error) {
        console.error("Error searching products:", error.response?.data?.message || error.message);
        throw error;
    }
};




const productApi = {
    addProduct,
    fetchProductsbyemployee,
    fetchProductsBySelectItem,
    getSingleProduct,
    getAllProduct,
    deleteProduct,
    changeProductStatus,
    AddTrackProduct,
    changeTrackStatus,
    getIntrackingProduct,
    dubaiProduct,
    updateProduct,
    allTrackingProduct,
    deleteTrack,
    searchProducts
};

export default productApi;