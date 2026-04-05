import { create } from "zustand";
import { api } from "../api/axios";

// Type for course inside a purchase
export type PurchasedCourse = {
  _id: string;
  userId: string;
  courseId: {
    _id: string;
    title: string;
    description?: string;
    price: number;
    image?: string;
    published: boolean;
    teacherId?:{ _id: string; name: string };
  };
  image: string;
  createdAt: string;
  updatedAt: string;
};

interface PurchasesState {
  purchasedCourses: PurchasedCourse[];
  fetchPurchasedCourses: () => Promise<void>;
  buyCourse: (courseId: string) => Promise<void>;
  checkIfPurchased: (courseId: string) => Promise<boolean>;
}

interface PurchaseApiResponse{
    success:boolean;
    data:PurchasedCourse[];
    length:number
}

interface PurchaseApiRequest{
    success:boolean;
    data:PurchasedCourse;
    message:string
}

export const usePurchasesStore = create<PurchasesState>((set, get) => ({
  purchasedCourses: [],

  // Fetch all purchases for the logged-in user
  fetchPurchasedCourses: async () => {
    try {
      const res = await api.get<PurchaseApiResponse>("/purchases/");
      set({ purchasedCourses: res.data.data });
    } catch (err) {
      console.error("Failed to fetch purchased courses", err);
      set({ purchasedCourses: [] });
    }
  },

  buyCourse: async (courseId: string) => {
    try {
      const res = await api.post<PurchaseApiRequest>(`/purchases/${courseId}`);
      set({ purchasedCourses: [...get().purchasedCourses, res.data.data] });
    } catch (err: any) {
      if (err.response?.data?.message) {
        alert(err.response.data.message); 
      } else {
        console.error("Failed to buy course", err);
      }
    }
  },

  
  checkIfPurchased: async (courseId: string) => {
    try {
      const res = await api.get<{ success: boolean; purchased: boolean }>(
        `/purchases/:courseId/check-purchase${courseId}`
      );
      return res.data.purchased;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
}));