import axiosInstance from './axiosInstance';

const addFlex = async (flexData) => {
    return await axiosInstance.post('/api/sellerflex/flex', flexData);
};

const getAllFlex = async (page, limit) => {
    return await axiosInstance.get(`/api/sellerflex/flex?page=${page}&limit=${limit}`);
};

const deleteFlex = async (id) => {
    return await axiosInstance.delete(`/api/sellerflex/flex/${id}`);
};

const updateFlex = async (id, flexData) => {
    return await axiosInstance.put(`/api/sellerflex/flex/${id}`, flexData);
};

export { addFlex, getAllFlex, deleteFlex, updateFlex };