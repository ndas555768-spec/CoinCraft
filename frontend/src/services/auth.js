import api from "./api";

export const login = async (data) => {
    const response = await api.post("accounts/login/", data);
    return response.data;
};

export const register = async (data) => {
    const response = await api.post("accounts/register/", data);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get("accounts/profile/");
    return response.data;
};

export const logout = async (refreshToken) => {
    const response = await api.post("accounts/logout/", {
        refresh: refreshToken,
    });

    return response.data;
};