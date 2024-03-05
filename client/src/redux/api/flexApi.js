import axiosInstance from './axiosInstance';

const addFlex = (flexData) => {
    return axiosInstance.post('/api/sellerflex/flex', flexData);
};

const getAllFlex = (page, limit) => {
    return axiosInstance.get(`/api/sellerflex/flex?page=${page}&limit=${limit}`);
};

const deleteFlex = (id) => {
    return axiosInstance.delete(`/api/sellerflex/flex/${id}`);
};

const updateFlex = (id, flexData) => {
    return axiosInstance.put(`/api/sellerflex/flex/${id}`, flexData);
};

export { addFlex, getAllFlex, deleteFlex, updateFlex };