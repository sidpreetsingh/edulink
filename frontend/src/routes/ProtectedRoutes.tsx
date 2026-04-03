import { Navigate,Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps{
    role? : "student"|"admin"|"teacher";
}

export default function ProtectedRoute({role}:ProtectedRouteProps){
    const {user,loading}=useAuthStore();
    
    if(loading){
        return <div>....Loading!!!</div>
    }
    if(!user){
        console.log("Not logged In")
        return <Navigate to="/login"/>
    }
    if(role && user.role!==role){
        return <Navigate to="/"/>
    }
    return <Outlet/>
}