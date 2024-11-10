import api from "../../AxiosConfig";
import { RegisterFormProduct } from "../../../validations/ProductSchema";
import { Produto } from '../../../types/Produto';

export const registerProduct = async (request: RegisterFormProduct): Promise<RegisterFormProduct> => {
    const response = await api.post(`/produto`, request);
    return response.data;
};

export const findAll = async (userId: number): Promise<Produto[]> => {
    const response = await api.get(`/produto/all/${userId}`);
    return response.data;
};