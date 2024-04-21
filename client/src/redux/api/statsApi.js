import axiosInstance from "./axiosInstance";

const getAllStats = async (timeFrame) => {
    try {
        const query = `?timeFrame=${timeFrame}`;
        const {data} = await axiosInstance.get('/api/stats/' + query);
        return data;
    } catch (error) {
        throw error.response.data
    }
}

const getAllCompletedDailyTasksWithEmployeeDetails = async () => {
    try {
        const {data} = await axiosInstance.get('/api/stats/completed-tasks');
        return data;
    } catch (error) {
        throw error.response.data
    }
}



const statsApi = {
    getAllStats,
    getAllCompletedDailyTasksWithEmployeeDetails
}

export default statsApi;