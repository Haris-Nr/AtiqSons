import axiosInstance from "./axiosInstance";

const createScreenShot = async (data, onSuccess, onFail) => {
    try {
        const response = await axiosInstance.post('/api/screenshot/create', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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


const getAllScreenShots = async (page, limit, search) => {
    try {
        const query = `?page=${page}&limit=${limit}&search=${search}`;
        const response = await axiosInstance.get('/api/screenshot/all' + query);

        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

const deleteScreenShot = async (id, onSuccess, onFail) => {
    try {
        const response = await axiosInstance.delete(`/api/screenshot/delete/${id}`);
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




const screenShotApi = {
    createScreenShot,
    getAllScreenShots,
    deleteScreenShot
}

export default screenShotApi;