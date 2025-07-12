import api from "./axiosInstance";

export const getProducts = async () => {
    const response = await api.get('/products/all')
    return await response.data
}

export const getProductsByCategory = async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`)
    return await response.data
}