import axiosInstance from './axiosInstance';


const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return await axiosInstance.post('/api/fiance/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};



const allImage = async () => {
    return await axiosInstance.get('/api/fiance/allfianceimage');
};

const deleteImage = async (id) => {
    return await axiosInstance.delete(`/api/fiance/delete/${id}`);
};


export {uploadImage,allImage,deleteImage};