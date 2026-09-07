//1. Sütun: Backend ile konuşan axios konfigürasyonu
import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use(
  (config) => {
    // Yerel depolamadan token'ı al
    const token = localStorage.getItem('token');

    // Eğer token varsa, Authorization başlığına ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
