import axiosInstance from "./axiosInstance";

/* add new notification*/
export const AddNotification = async (data) => {
  try {
    const response = await axiosInstance.post("/api/notification/notify", data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

/* get all notifications by user*/
export const FetchAllNotifications = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/notification/fetchAllNotifications"
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

/* delete a existing notification  by id*/
export const DeleteNotification = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/notification/deleteNotification/${id}`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const SeenSingleNotification = async (notificationId) => {
  try {
    const response = await axiosInstance.patch(
      "/api/notification/seenNotification",
      { notificationId: notificationId }
    );
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
};

export const DeleteAllNotifications = async () => {
  try {
    const response = await axiosInstance.delete('/api/notification/deleteAll');
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
};
