import axiosInstance from "./axiosInstance";

// Create a new fullfilment
export const createFullfilment = (fullfilmentData) => {
  return axiosInstance.post("/api/fullfilment/fullfilments", fullfilmentData);
};

// Get all fullfilments
export const getAllFullfilments = () => {
  return axiosInstance.get("/api/fullfilment/fullfilments");
};

// Update a fullfilment by id
export const updateFullfilment = (id, fullfilmentData) => {
  return axiosInstance.put(`/api/fullfilment/fullfilments/${id}`, fullfilmentData);
};

// Delete a fullfilment by id
export const deleteFullfilment = (id) => {
  return axiosInstance.delete(`/api/fullfilment/fullfilments/${id}`);
};
