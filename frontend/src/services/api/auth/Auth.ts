import axios from "axios";
import { LoginFormData } from "../../../validations/LoginSchema";
import { RegisterFormData } from "../../../validations/RegisterSchema";
const api = import.meta.env.VITE_API_URL;

export const login = async (request: LoginFormData) => {
    const response = await axios.post(`${api}/auth/login`, request);
    return response.data;
};

export const registerUserAdmin = async (request: RegisterFormData): Promise<RegisterFormData> => {

    const data = {
        nome: request.name,
        email: request.email,
        password: request.password,
        cpf: request.cpf,
        tipo: 'ADMIN'
    }

    const response = await axios.post(`${api}/user`, data);
    return response.data;
};

