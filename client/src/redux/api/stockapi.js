import axiosInstance from "./axiosInstance";

const addStock = async (stockdata) => {
    try {
        const response = await axiosInstance.post(
            `/api/stock/addstock`,
            stockdata,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const getStock = async (search = "", page = 1, limit = 10) => {
    try {
        // Construct query parameters
        const queryParams = new URLSearchParams({
            search,
            page,
            limit,
        }).toString();

        const response = await axiosInstance.get(
            `/api/stock/stock?${queryParams}`
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const uploadStock = async (file) => {
    try {
        let formData = new FormData();
        formData.append("file", file.file.fileList[0].originFileObj);

        const response = await axiosInstance.post(
            `/api/stock/uploadstock`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error.response.data;
    }
};

const deleteStock = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/stock/stock/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const editStock = async (id, stockData) => {
    try {
        const response = await axiosInstance.put(
            `/api/stock/stock/${id}`,
            stockData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export default {
    addStock,
    getStock,
    uploadStock,
    deleteStock,
    editStock
};
