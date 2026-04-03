import { api } from "../api/axios";
import type { Course } from "../store/publicCoursesStore";


interface CoursesApiResponse {
    success: boolean;
    data: Course;
  }

export const getAllCoursesNonPublic= async (): Promise<Course[]> => {
    const res = await api.get<Course[]>("/courses/");
    return res.data;
  };

  export const getCourseById = async (courseId: string): Promise<Course> => {
    const res = await api.get<CoursesApiResponse>(`/${courseId}`);
    console.log(res);
    return res.data.data;
  };

