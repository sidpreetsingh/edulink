import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, BookOpen, Users, LogOut, Menu, X, Home } from "lucide-react";
import { api } from "../api/axios";

export default function TeacherLayout() {
  const { user, loading, logout } = useAuthStore();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  if (loading) return null;

  // Protect route
  if (!user || user.role !== "teacher") {
    return <Navigate to="/" />;
  }

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        mainRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !mainRef.current.contains(event.target as Node)
      ) {
        if (!isHovering) {
          setCollapsed(true);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHovering]);

  const navItems = [
    { name: "Dashboard", path: "/teacher", icon: LayoutDashboard },
    { name: "Courses", path: "/teacher/courses", icon: BookOpen },
    { name: "Students", path: "/teacher/students", icon: Users },
  ];

  const shouldExpand = !collapsed || isHovering;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          if (collapsed) setCollapsed(true);
        }}
        className={`bg-gradient-to-b from-violet-100 via-slate-50 to-gray-50 backdrop-blur-sm bg-opacity-80 text-slate-900 transition-all duration-300 ${
          shouldExpand ? "w-64" : "w-20"
        } flex flex-col shadow-xl border-r border-slate-200`}
      >
        {/* Logo */}
        <div className={`p-6 border-b border-slate-200 ${shouldExpand ? "" : "flex justify-center"}`}>
          <div className={`flex items-center gap-3 ${shouldExpand ? "" : "justify-center"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-lg">
              {shouldExpand ? "EL" : "E"}
            </div>
            {shouldExpand && (
              <div>
                <p className="font-bold text-lg text-slate-900">EduLink</p>
                <p className="text-xs text-slate-600">Teacher Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "text-slate-700 hover:bg-white/50 hover:text-blue-600"
                }`}
              >
                <Icon 
                  size={22} 
                  className={`transition-transform duration-200 flex-shrink-0 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                />
                {shouldExpand && (
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`p-4 border-t border-slate-200 ${shouldExpand ? "" : "flex justify-center"}`}>
          <button
            onClick={logout}
            className={`transition-all duration-200 flex items-center justify-center gap-2 font-semibold rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg ${
              shouldExpand ? "w-full py-3" : "p-3"
            }`}
          >
            <LogOut size={20} />
            {shouldExpand && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div ref={mainRef} className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left: Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-700 hover:text-blue-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
            >
              {collapsed && !isHovering ? <Menu size={24} /> : <X size={24} />}
            </button>

            {/* Center: Title */}
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Teacher Dashboard
            </div>

            {/* Right: User Info & Home Button */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-slate-700 hover:text-blue-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
                title="Go to Homepage"
              >
                <Home size={24} />
              </Link>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-600 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-violet-100 via-slate-50 to-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}