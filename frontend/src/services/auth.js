import api from "./api";

export const login = async (data) => {
    const response = await api.post("accounts/login/", {
        email: data.email,
        password: data.password,
    });

    return response.data;
};

export const registerUser = async (data) => {
    const response = await api.post("accounts/register/", {
        username: data.username,
        email: data.email,
        password: data.password,
    });

    return response.data;
};