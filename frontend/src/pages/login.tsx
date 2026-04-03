import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import loginSvg from "../assets/undraw_online-learning_tgmv.svg";

const Login= ()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error, setError] = useState("");
    const navigate=useNavigate();

    const handleLogin= async(e: React.FormEvent) => {
        e.preventDefault();

        try{
            const data= await login({email:email,password:password});
            localStorage.setItem("token",data.token);
            console.log("Login Success: ",data);
            setError("");
            navigate("/");
        }
        catch(err:any){
          if (err.response?.status === 404 || err.response?.data?.message === "User not found") {
            setError("User not found. Please sign up first.");
            setTimeout(() => navigate("/signup"), 1500);
          } else {
            setError(err.response?.data?.message || "Login failed");
          }
    }
  }

    return (
        <div className="min-h-screen bg-linear-to-b from-violet-100 via-slate-50 to-gray-50 flex items-center justify-center">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div className="hidden md:flex items-center justify-center">
              <img src={loginSvg} alt="login illustration" className="w-[400px] lg:w-[500px]" />
            </div>

            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg mx-auto">
              <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Welcome Back</h1>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm animate-[fadeIn_0.3s_ease-in-out]">
                  <span className="text-xl">⚠️</span>
                  <div className="text-sm leading-relaxed">
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button type="submit" className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors font-semibold">
                  Login
                </button>
              </form>
            </div>

          </div>
        </div>
      );
    }
export default Login;