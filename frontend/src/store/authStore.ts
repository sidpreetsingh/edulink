import { create } from "zustand";
import type { UserProfile } from "../types/user";
import { api } from "../api/axios";


interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading:boolean
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  loadUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading:true,
  
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  setUser: (userUpdate) =>
    set((state) => ({
      user: { ...state.user, ...userUpdate } as UserProfile,
    })),

  
  loadUser: async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      return set({ user: null, loading: false }); 
    }
  
    try {
      const res = await api.get("/users/my-profile");
      set({ user: res.data, loading: false }); 
    } catch {
      set({ user: null, token: null, loading: false }); 
      localStorage.removeItem("token");
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));