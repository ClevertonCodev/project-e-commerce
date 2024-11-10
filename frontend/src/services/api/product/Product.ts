import api from "../../AxiosConfig";
import { RegisterFormProduct } from "../../../validations/ProductSchema";
import { Produto } from '../../../types/Produto';

export const registerProduct = async (request: RegisterFormProduct): Promise<RegisterFormProduct> => {
    const response = await api.post(`/produto`, request);
    return response.data;
};

export const findAll = async (userId?: number | undefined): Promise<Produto[]> => {
    if (userId) {
        const response = await api.get(`/produto/all/${userId}`);
        return response.data;
    }
    const response = await api.get(`/produto/all`);
    return response.data;
};

export const addProductsCart = async (userId: number): Promise<Produto[]> => {
    const response = await api.get(`/produto/all/${userId}`);
    return response.data;
};