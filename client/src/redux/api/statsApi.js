import axiosInstance from "./axiosInstance";

const getAllStats = async (timeFrame) => {
    try {
        const query = `?timeFrame=${timeFrame}`;
        const response = await axiosInstance.get('/api/stats/' + query);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}


const statsApi = {
    getAllStats
}

export default statsApi;