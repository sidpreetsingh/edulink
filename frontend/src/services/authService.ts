import { api } from "../api/axios";


export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/signin", data);
  return res.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};