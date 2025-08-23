import axios from "axios";
import { API_BASE_URL, API_KEY } from "./constants";

// Instance axios terpusat untuk API utama
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-API-KEY": API_KEY,
  },
});

export default axiosInstance;
