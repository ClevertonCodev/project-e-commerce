import axios from "axios";
import { LoginFormData } from "../../../validations/LoginSchema";
const api = import.meta.env.VITE_API_URL;

export const login = async (request: LoginFormData) => {
    const response = await axios.post(`${api}/auth/login`, request);
    return response.data;
};
