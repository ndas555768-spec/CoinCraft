import api from "./api";

export const getNotifications = async (params = {}) => {
  const response = await api.get("notifications/", { params });
  return response.data;
};

export const markAsRead = async (id, isRead = true) => {
  const response = await api.patch(`notifications/${id}/`, { is_read: isRead });
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.post("notifications/mark-all-read/");
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`notifications/${id}/`);
  return response.data;
};
