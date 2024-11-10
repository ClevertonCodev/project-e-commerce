import api from "../../AxiosConfig";
import { Items, Payload } from "../../../types/Cart";
import { RegisterClientFormData } from '../../../validations/RegisterClientSchema';

export const addItemsCart = async (request: Payload) => {
    const response = await api.post(`/pedido/carrinho/add`, JSON.stringify(request), {
        withCredentials: true,
    });
    return response.data;
};

export const getCart = async (): Promise<Items> => {
    const response = await api.get(`/pedido/chekout`, {
        withCredentials: true,
    });
    return response.data;
};

export const orderSave = async (request: RegisterClientFormData) => {
    const response = await api.post(`/pedido/salvar`, request, {
        withCredentials: true,
    });
    return response.data;
}

export const getOrders = async (userId?: number | undefined) => {
    if (userId) {
        const response = await api.get(`/pedido/${userId}`);
        return response.data;
    }
    const response = await api.get(`/pedido`);
    return response.data;
}
