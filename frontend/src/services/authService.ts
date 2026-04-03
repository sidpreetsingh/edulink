import { api } from "../api/axios";
import { useAuthStore } from "../store/authStore";


export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/signin", data);
  useAuthStore.getState().setUser(res.data.user);
  useAuthStore.getState().setToken(res.data.token);
  return res.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/signup", data);
  useAuthStore.getState().setUser(res.data.user);
  useAuthStore.getState().setToken(res.data.token);
  return res.data;
};