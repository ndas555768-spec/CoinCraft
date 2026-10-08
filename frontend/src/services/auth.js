import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("accounts/login/", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("accounts/register/", userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("accounts/me/");
  return response.data;
};

export const updateProfile = async (profileData) => {
  // Support multipart form data if profile picture is present
  const isFormData = profileData instanceof FormData;
  const response = await api.patch("accounts/me/", profileData, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const logoutUser = async (refreshToken) => {
  try {
    if (refreshToken) {
      await api.post("accounts/logout/", { refresh: refreshToken });
    }
  } catch (e) {
    console.error("Logout error:", e);
  } finally {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
};