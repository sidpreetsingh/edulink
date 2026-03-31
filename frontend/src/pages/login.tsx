import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login= ()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();

    const handleLogin= async(e: React.FormEvent) => {
        e.preventDefault();

        try{
            const data= await login({email:email,password:password});
            localStorage.setItem("token",data.token);
            console.log("Login Success: ",data);
            navigate("/dashboard");
        }
        catch(err){
            console.error("Login Failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
            <h1 className="text-3xl font-semibold mb-8 text-center text-white">LogIn</h1>
      
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 bg-gray-700 text-white border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
        
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 bg-gray-700 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
        
              <button type="submit" className="bg-indigo-700 text-white py-3 rounded-md hover:bg-indigo-800 transition-colors font-semibold">Login</button>
            </form>
          </div>
        </div>
      );
    }
export default Login;