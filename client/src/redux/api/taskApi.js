import axiosInstance from './axiosInstance';

const addTask = async (taskData) => {
    try {
        const response = await axiosInstance.post(`/api/task/addtask`, taskData);
        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};


const fetchTasksForEmployee = async () => {
    try {
        const response = await axiosInstance.get(`/api/task/fetchTaskForEmployee`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const dailyTasksForEmployee = async () => {
    try {
        const response = await axiosInstance.get(`/api/task/dailytask`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const fetchTasksAllEmployee = async () => {
    try {
        const response = await axiosInstance.get(`/api/task/fetchTaskAllEmployee`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const changeStatus = async (id, newStatus) => {
    try {
        const response = await axiosInstance.patch(`/api/task/changestatus/${id}`,{ status: newStatus });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const deleteTask = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/task/deletetask/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const taskApi = {
    addTask,
    fetchTasksForEmployee,
    changeStatus,
    fetchTasksAllEmployee,
    deleteTask,
    dailyTasksForEmployee
};

export default taskApi;