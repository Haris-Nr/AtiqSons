import axiosInstance from './axiosInstance';


const getBreaks = async (page, pageSize, search) => {
    try {
        const response = await axiosInstance.get(`/api/break?page=${page}&limit=${pageSize}&search=${search}&filter=break`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}


const getLeaves = async (page, pageSize, search) => {
    try {
        const response = await axiosInstance.get(`/api/break?page=${page}&limit=${pageSize}&search=${search}&filter=leave`);
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}


const createBreak = async (startTime, endTime, isLeave, onSucess, onFail) => {
    try {
        const response = await axiosInstance.post('/api/break', {
            startTime,
            endTime,
            isLeave
        });

        if (response.status === 201 || response.status === 200) {
            onSucess();
            return response.data;
        } else {
            onFail();
        }
    } catch (error) {
        onFail();
        throw error.response.data
    }
}


const approveLeave = async (id, onSuccess, onFail) => {
    try {
        const response = await axiosInstance.put(`/api/break/${id}/approve`);
        if (response.status === 200) {
            onSuccess();
        } else {
            onFail();
        }
    } catch (error) {
        onFail();
        throw error.response.data
    }
}

const rejectLeave = async (id, onSuccess, onFail) => {
    try {
        const response = await axiosInstance.put(`/api/break/${id}/reject`);
        if (response.status === 200) {
            onSuccess();
        } else {
            onFail();
        }
    } catch (error) {
        onFail();
        throw error.response.data
    }
}


export default {
    getBreaks,
    createBreak,
    getLeaves,
    approveLeave,
    rejectLeave
}