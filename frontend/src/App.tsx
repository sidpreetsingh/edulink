import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import AuthLayout from "./components/authLayout";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Home from "./pages/home";
import CourseDetailPage from "./pages/courseDetail";
import Courses from "./pages/courses";
import Dashboard from "./pages/dashboard";
import Layout from "./components/Layout";
import ProfilePage from "./pages/profile";
import AdminLayout from "./components/adminLayout";
import AdminDashboard from "./pages/adminDashboard";
import AdminCourses from "./pages/adminCourses";
import { Toaster } from "react-hot-toast";
import AdminPurchases from "./pages/adminPurchases";
import AdminUsers from "./pages/adminUsers";
import TeacherLayout from "./components/teacherLayout";
import TeacherDashboard from "./pages/teacherDashboard";
import TeacherStudents from "./pages/teacherStudents";
import TeacherCourses from "./pages/teacherCourses";

export default function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser(); // populates the store on app start
  }, [loadUser]);

  
  
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        
          <Route element={<AuthLayout/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> 
          </Route>
          
          
          <Route element={<Layout/>}>
            <Route path="/" element={<Home/>}/>  
            <Route path="/courses/:courseId" element={<CourseDetailPage/>}/>
            <Route path="/courses" element={<Courses/>}/>
          </Route>
        
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard/>} />
            <Route path="/admin/courses" element={<AdminCourses/>}/>
            <Route path="/admin/purchases" element={<AdminPurchases/>} />
            <Route path="/admin/users" element={<AdminUsers/>} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="teacher" />}>
          <Route element={<TeacherLayout />}>
            <Route path="/teacher" element={<TeacherDashboard/>} />
            <Route path="/teacher/courses" element={<TeacherCourses/>}/>
            <Route path="/teacher/students" element={<TeacherStudents/>} />
            
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}