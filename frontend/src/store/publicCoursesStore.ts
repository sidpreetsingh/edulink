import {create} from 'zustand';
import {api} from './../api/axios';

export type Course = {
    _id: string;
    title: string;
    description?: string;
    price: number;
    image?: string;
    published: boolean;
    teacherId: { _id: string; name: string };
};

export interface CoursesApiResponse {
    success: boolean;
    data: Course[];
  }

interface CoursesState {
    courses: Course[];
    fetchCourses: () => Promise<void>;
}

export const usePublicCoursesStore=create<CoursesState>((set)=>({
    courses:[],
    fetchCourses:async()=>{
        try{
            const res=await api.get<CoursesApiResponse>("/");
            set({courses: res.data.data});
        }catch(err){
            console.error(err);
        }
    }
}))

