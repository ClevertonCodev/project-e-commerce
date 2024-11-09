import axios, { InternalAxiosRequestConfig } from "axios";
import getToken from "./api/auth/GetToken"

const apiUrl = process.env.API_URL;

const getBearerToken = async (config: InternalAxiosRequestConfig) => {
  const token = await getToken(true);
  const newConfig = { ...config };

  if (newConfig.headers) {
    newConfig.headers.Authorization = token;
  }

  return newConfig;
};

const api = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use(getBearerToken);

export default api;
