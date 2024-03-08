import axiosInstance from "./axiosInstance";

const createActivityLog = async (data, onSuccess, onFail) => {
    try {
        const response = await axiosInstance.post('/api/activity-log', data);
        if (response.status === 200 || response.status === 201) {
            onSuccess();
        } else {
            onFail();
        }
        return response;
    } catch (error) {
        onFail();
        throw error.response.data
    }
}

const getAllActivityLogs = async (page, limit, search) => {
    try {
        const query = `?page=${page}&limit=${limit}&search=${search}`;
        const response = await axiosInstance.get('/api/activity-log' + query);

        return response.data;
    } catch (error) {
        throw error.response.data
    }
}


const getAggregatedLogs = async (page, limit, search) => {
    try {
        const query = `?page=${page}&limit=${limit}&search=${search}`;
        const response = await axiosInstance.get('/api/activity-log/aggregated' + query);

        return response.data;
    } catch (error) {
        throw error.response.data
    }
}



const deleteActivityLog = async (id, onSuccess, onFail) => {
    try {
        const response = await axiosInstance.delete(`/api/activity-log/${id}`);
        if (response.status === 200) {
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

const activityLogApi = {
    createActivityLog,
    getAllActivityLogs,
    deleteActivityLog,
    getAggregatedLogs
}

export default activityLogApi;