import axiosInstance from './axiosInstance';


const uploadImage = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return axiosInstance.post('/api/fiance/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};



const allImage = () => {
    return axiosInstance.get('/api/fiance/allfianceimage');
};

const deleteImage = (id) => {
    return axiosInstance.delete(`/api/fiance/delete/${id}`);
};


export {uploadImage,allImage,deleteImage};