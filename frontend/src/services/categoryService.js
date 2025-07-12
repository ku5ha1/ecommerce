import api from "./axiosInstance";

export const getCategories = async () => {
    const response = await api.get('/categories/all')
    return await response.data
}

export const getAllCategories = async () => {
    const response = await api.get('/categories/all')
    return await response.data
}