import axios, { InternalAxiosRequestConfig } from "axios";
import getToken from "./api/auth/GetToken"

const apiUrl = import.meta.env.VITE_API_URL;

const getBearerToken = async (config: InternalAxiosRequestConfig) => {
  const token = await getToken(true);
  const newConfig = { ...config };

  if (newConfig.headers) {
    newConfig.headers.Authorization = token;
  }

  return newConfig;
};

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use(getBearerToken);

export default api;
