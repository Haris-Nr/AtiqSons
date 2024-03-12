import axiosInstance from "./axiosInstance";

// Create a new fullfilment
export const createFullfilment = async (fullfilmentData) => {
  return await axiosInstance.post("/api/fullfilment/fullfilments", fullfilmentData);
};

// Get all fullfilments
export const getAllFullfilments = async () => {
  return await axiosInstance.get("/api/fullfilment/fullfilments");
};

// Update a fullfilment by id
export const updateFullfilment = async (id, fullfilmentData) => {
  return await axiosInstance.put(`/api/fullfilment/fullfilments/${id}`, fullfilmentData);
};

// Delete a fullfilment by id
export const deleteFullfilment = async (id) => {
  return await axiosInstance.delete(`/api/fullfilment/fullfilments/${id}`);
};
