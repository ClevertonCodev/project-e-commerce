import axios, { AxiosRequestConfig } from "axios";
import getToken from "./api/auth/GetToken"
const apiUrl = process.env.API_URL;

const getBearerToken = async (config: AxiosRequestConfig) => {
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
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  }
});

api.interceptors.request.use(getBearerToken);

export default api;
