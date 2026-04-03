import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import { Users, BookOpen, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import welcomeSvg from "../assets/undraw_online-learning_tgmv.svg";

type RecentPurchase = {
  _id: string;
  userName: string;
  courseTitle: string;
  price: number;
  createdAt: string;
};

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalTeachers: number;
    totalCourses: number;
    totalPurchases: number;
    totalRevenue: number;
    recentPurchases: RecentPurchase[];
    activeCourses: number;
    archivedCourses: number;
  }>({
    totalUsers: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    recentPurchases: [],
    activeCourses: 0,
    archivedCourses: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-10 shadow-sm">
        <div className="flex items-center justify-between gap-12">
          {/* Left - Text */}
          <div className="flex-1">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">Welcome back</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Hi, <span className="text-blue-600">{user?.name}</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Here's an overview of your platform's performance
            </p>
          </div>

          {/* Right - SVG */}
          <div className="flex-1 hidden lg:flex items-center justify-center">
            <img src={welcomeSvg} alt="admin welcome" className="w-72 h-72 object-contain" />
          </div>
        </div>
      </div>

      {/* Stats Grid - 5 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Total Users</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers}</h2>
          <p className="text-xs text-gray-500">All registered users</p>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Teachers</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalTeachers}</h2>
          <p className="text-xs text-gray-500">Active instructors</p>
        </div>

        {/* Total Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BookOpen size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Courses</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalCourses}</h2>
          <p className="text-xs text-gray-500">Published courses</p>
        </div>

        {/* Total Purchases */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ShoppingCart size={20} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Purchases</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalPurchases}</h2>
          <p className="text-xs text-gray-500">Total enrollments</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-rose-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-100 rounded-lg">
              <TrendingUp size={20} className="text-rose-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Revenue</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">₹{stats.totalRevenue.toFixed(2)}</h2>
          <p className="text-xs text-gray-500">Total earnings</p>
        </div>
      </div>

      {/* Course Status & Recent Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-500 ease-in-out">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Course Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all duration-500 ease-in-out">
              <span className="text-sm font-semibold text-gray-700">Active</span>
              <span className="text-2xl font-bold text-green-600">{stats.activeCourses}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-500 ease-in-out">
              <span className="text-sm font-semibold text-gray-700">Archived</span>
              <span className="text-2xl font-bold text-gray-600">{stats.archivedCourses}</span>
            </div>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-500 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Purchases</h3>
            <Link to="/admin/purchases" className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 transition-all duration-300 ease-in-out">
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPurchases.length > 0 ? (
                  stats.recentPurchases.slice(0, 5).map((p, idx) => (
                    <tr key={p._id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-all duration-300 ease-in-out`}>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{p.userName}</td>
                      <td className="px-4 py-3 text-gray-700">{p.courseTitle}</td>
                      <td className="px-4 py-3 font-bold text-green-600">₹{p.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {new Date(p.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                      No recent purchases
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div>
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/courses"
            className="flex items-center justify-between bg-white border border-gray-200 hover:border-blue-400 hover:shadow-lg text-gray-900 px-6 py-4 rounded-lg shadow-sm transition-all duration-500 ease-in-out font-semibold group"
          >
            <span className="flex items-center gap-3">
              <BookOpen size={20} className="text-blue-600" />
              Manage Courses
            </span>
            <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 transition-all duration-300 ease-in-out" />
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center justify-between bg-white border border-gray-200 hover:border-purple-400 hover:shadow-lg text-gray-900 px-6 py-4 rounded-lg shadow-sm transition-all duration-500 ease-in-out font-semibold group"
          >
            <span className="flex items-center gap-3">
              <Users size={20} className="text-purple-600" />
              Manage Users
            </span>
            <ArrowRight size={18} className="text-gray-400 group-hover:text-purple-600 transition-all duration-300 ease-in-out" />
          </Link>
          <Link
            to="/admin/purchases"
            className="flex items-center justify-between bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-lg text-gray-900 px-6 py-4 rounded-lg shadow-sm transition-all duration-500 ease-in-out font-semibold group"
          >
            <span className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-emerald-600" />
              Manage Purchases
            </span>
            <ArrowRight size={18} className="text-gray-400 group-hover:text-emerald-600 transition-all duration-300 ease-in-out" />
          </Link>
        </div>
      </div>
    </div>
  );
}