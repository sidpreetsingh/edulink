export type CourseSummary = {
    _id: string;
    title: string;
    price: number;
  };
  
  export type UserProfile = {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "teacher" | "student";
    profileImage: string | null;
    purchasedCoursesId: CourseSummary[];
    createdCoursesId: CourseSummary[];
    createdAt: string;
    updatedAt: string;
  };