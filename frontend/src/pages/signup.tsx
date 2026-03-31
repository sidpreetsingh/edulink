import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Signup= ()=>{
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();

    const handleSignup= async(e: React.FormEvent) => {
        e.preventDefault();

        try{
            const data= await register({name:name,email:email,password:password});
            localStorage.setItem("token", data.token);
            
            console.log("Signup Success: ",data);
            navigate("/dashboard");
        }
        catch(err){
            console.error("Signup Failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
            <h1 className="text-3xl font-semibold mb-8 text-center text-white">Sign Up</h1>
      
            <form onSubmit={handleSignup} className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              />

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              />
        
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              />
        
              <button type="submit" className="bg-indigo-700 text-white py-3 rounded-md hover:bg-indigo-800 transition-colors">Sign Up</button>
            </form>
          </div>
        </div>
      );
    }
export default Signup;