import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// Request Interceptor (Attach Token)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

//Response Interceptor(Runs after every response it sent to check if it's good or there is error(acts as global error handler))

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;

    
    if (status === 401) {
      localStorage.removeItem("token");
    }

    console.error(
      (error.response?.data as any)?.message ||
      error.message ||
      "API error"
    );

    return Promise.reject(error);
  }
);