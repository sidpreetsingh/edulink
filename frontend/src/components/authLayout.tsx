import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between p-4 px-6">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-blue-600 tracking-tight hover:scale-105 transition-transform duration-200"
          >
            EduLink
          </Link>

          {/* Only Home Link */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="relative group hover:text-blue-600 transition-colors duration-200"
            >
              <span>Home</span>
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
      </header>

      <main>
      
          <Outlet />
       
      </main>

      <footer className="bg-blue-600 text-center text-white py-4 text-sm">
        © {new Date().getFullYear()} EduLink. Built for learning 🚀
      </footer>
    </div>
  );
};

export default AuthLayout;