import axiosInstance from "./axiosInstance";

const addStock = async (stockdata) => {
    try {
        const response = await axiosInstance.post(
            `/api/inventory/addstock`,
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
            `/api/inventory/stock?${queryParams}`
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
            `/api/inventory/uploadstock`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        // console.log(response);
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error.response.data;
    }
};

const deleteStock = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/inventory/stock/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const editStock = async (id, stockData) => {
    try {
        console.log(id, stockData);

        const response = await axiosInstance.put(
            `/api/inventory/stock/${id}`,
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
