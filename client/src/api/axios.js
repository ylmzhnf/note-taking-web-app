//1. Sütun: Backend ile konuşan axios konfigürasyonu
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
    headers:{
        "Content-Type":"application/json"
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