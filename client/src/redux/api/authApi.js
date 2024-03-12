import axiosInstance from "./axiosInstance";

const signup = async (userData) => {
    try {
        const { data } = await axiosInstance.post(`/api/user/signup`, userData);
        return data;
    } catch (error) {
        throw error.response.data;
    }
};

const login = async (userData) => {
    try {
        const { data } = axiosInstance.post(`/api/user/login`, userData);
        return data;
    } catch (error) {
        throw error.response.data;
    }
};

const currentUser = async () => {
    try {
        const { data } = await axiosInstance.get(`/api/user/currentuser`);
        return data;
    } catch (error) {
        throw error.response.data;
    }
};

const resetPassword = async (resetData) => {
    try {
        const { data } = await axiosInstance.patch(
            `/api/user/resetpassword`,
            resetData
        );
        return data;
    } catch (error) {
        throw error.response.data;
    }
};

const logout = async (userId) => {
    try {
        const { data } = await axiosInstance.post(`/api/user/logout`, { userId });
        return data;
    } catch (error) {
        throw error.response.data;
    }
};

const getAllLogs = async (page, limit) => {
    try {
        const queryParams = `?page=${page}&limit=${limit}`;
        const { data } = await axiosInstance.get(`/api/log/logs${queryParams}`);
        return data;
    } catch (error) {
        throw error.response.data;
    }
};

const deleteAllLogs = async () => {
    try {
        const { data } = await axiosInstance.delete(`/api/log/logs`);
        return data;
    } catch (error) {
        throw error.response.data;
    }
};

const authApi = {
    signup,
    login,
    currentUser,
    resetPassword,
    logout,
    getAllLogs,
    deleteAllLogs,
};

export default authApi;
