import axiosInstance from "./axiosInstance";

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
