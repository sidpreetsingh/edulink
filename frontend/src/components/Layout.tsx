import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/EL.svg";

export default function Layout() {
  const { user, loading, logout } = useAuthStore();
  const navigate = useNavigate();

  if (loading) return null; // prevent flicker

  return (
    <div className="flex flex-col min-h-screen">

      {/* ================= Navbar ================= */}
      <header className="bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all duration-300">
        <div className="container m-auto flex items-center justify-between px-6 py-4 ">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold text-blue-600 tracking-tight hover:scale-105 transition-transform duration-200"
          >
            <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            EduLink
          </Link>
          {/* Links */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            {/* Common */}
            <Link
              to="/"
              className="relative group hover:text-blue-600 transition-colors duration-200"
            >
              <span>Home</span>
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {/* Logged OUT */}
            {!user && (
              <>
                <Link
                  to="/courses"
                  className="relative group hover:text-blue-600 transition-colors duration-200"
                >
                  <span>Courses</span>
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/login"
                  className="relative group hover:text-blue-600 transition-colors duration-200"
                >
                  <span>Login</span>
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
            {/* Logged IN */}
            {user && (
              <>
                <Link
                  to="/courses"
                  className="relative group hover:text-blue-600 transition-colors duration-200"
                >
                  <span>Courses</span>
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/dashboard"
                  className="relative group hover:text-blue-600 transition-colors duration-200"
                >
                  <span>Dashboard</span>
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/profile"
                  className="relative group hover:text-blue-600 transition-colors duration-200"
                >
                  <span>My Profile</span>
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="relative group hover:text-blue-600 transition-colors duration-200"
                  >
                    <span>Admin Panel</span>
                    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {user.role === "teacher" && (
                  <Link
                    to="/teacher"
                    className="relative group hover:text-blue-600 transition-colors duration-200"
                  >
                    <span>Teacher Panel</span>
                    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                <button
                  onClick={async () => {
                    logout();
                    window.location.href = "/";     
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-200 shadow-sm"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ================= Main ================= */}
      <main className="flex-1 px-6 py-8 bg-gradient-to-b from-violet-100 via-slate-50 to-gray-50">
        <div className="animate-fadeIn">
          <Outlet />
        </div>
      </main>

      {/* ================= Footer ================= */}
      <footer className="bg-gradient-to-b from-violet-100 via-slate-50 to-gray-50 shadow-md mt-auto border-t border-gray-200">
        <div className="container m-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo & About */}
            <div className="space-y-3">
              <Link
                to="/"
                className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
              >
                <img src={logo} alt="logo" className="w-6 h-6 object-contain" />
                <span className="text-lg font-bold text-blue-600">EduLink</span>
              </Link>
              <p className="text-gray-600 text-sm">
                Empowering learners worldwide with quality education and expert-led courses.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/courses" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    Browse Courses
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Get in Touch</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:sidpreetsandhu29@gmail.com"
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-semibold"
                  >
                    sidpreetsandhu29@gmail.com
                  </a>
                </li>
                <li className="text-gray-600">
                  LinkedIn:{" "}
                  <a
                    href="https://www.linkedin.com/in/sidpreetsingh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Connect with me
                  </a>
                </li>
                <li className="text-gray-600">
                  GitHub:{" "}
                  <a
                    href="https://www.github.com/sidpreetsingh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Connect with me
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-gray-600 text-sm">
              Made with <span className="text-red-500">❤️</span> by <span className="font-semibold text-gray-900">Sidpreet</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}