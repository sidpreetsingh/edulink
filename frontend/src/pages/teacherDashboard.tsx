import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import { BookOpen, Users, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import teacherWelcomeSvg from "../assets/undraw_cli-coding-agent_jtq1.svg"; // Import your SVG

type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  createdAt: string;
};

type CourseStat = {
  courseId: string;
  courseTitle: string;
  totalPurchases: number;
  totalRevenue: number;
};

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        api.get("/courses/teacher"),
        api.get("/purchases/enrollments"),
      ]);

      const coursesData = coursesRes.data?.data || [];
      const enrollmentsData = enrollmentsRes.data?.data || [];

      // Calculate stats from enrollments
      const statsMap = new Map<string, CourseStat>();

      enrollmentsData.forEach((enrollment: any) => {
        const courseId = enrollment.courseId._id;
        const courseTitle = enrollment.courseId.title;
        const price = enrollment.price || 0;

        if (!statsMap.has(courseId)) {
          statsMap.set(courseId, {
            courseId,
            courseTitle,
            totalPurchases: 0,
            totalRevenue: 0,
          });
        }

        const stat = statsMap.get(courseId)!;
        stat.totalPurchases += 1;
        stat.totalRevenue += price;
      });

      setCourses(coursesData);
      setCourseStats(Array.from(statsMap.values()));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalCourses = courses.length;
  const totalPurchases = courseStats.reduce((sum, s) => sum + s.totalPurchases, 0);
  const totalRevenue = courseStats.reduce((sum, s) => sum + s.totalRevenue, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
           {/* Welcome Section */}
           <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 shadow-sm hover:shadow-lg  ">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          {/* Left - Text */}
          <div className="flex-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Welcome back</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hi, <span className="text-blue-600">{user?.name}</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Here's an overview of your teaching performance
            </p>
          </div>

            {/* Right - SVG */}
            <div className="flex-1 hidden lg:flex items-center justify-center">
            <img src={teacherWelcomeSvg} alt="teacher welcome" className="w-72 h-72 object-contain" />
          </div>
        </div>
      </div>

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Total Courses</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{totalCourses}</h2>
          <p className="text-xs text-gray-500">Published courses</p>
        </div>

        {/* Total Purchases */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Total Purchases</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{totalPurchases}</h2>
          <p className="text-xs text-gray-500">Student enrollments</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">₹{totalRevenue.toFixed(2)}</h2>
          <p className="text-xs text-gray-500">Earnings</p>
        </div>

        {/* Avg Price */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Avg Price</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ₹{totalCourses > 0 ? (courses.reduce((sum, c) => sum + c.price, 0) / totalCourses).toFixed(2) : "0.00"}
          </h2>
          <p className="text-xs text-gray-500">Per course</p>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-500 ease-in-out">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">My Courses</h2>
          <Link to="/teacher/courses" className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 transition-all duration-300 ease-in-out">
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {courses.slice(0, 6).map((course) => {
              const stat = courseStats.find((s) => s.courseId === course._id);
              return (
                <div key={course._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-500 ease-in-out flex flex-col">
                  {/* Course Image */}
                  <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    {course.image ? (
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={40} className="text-gray-300" />
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                      {course.description}
                    </p>

                    <div className="space-y-2 mb-3 pb-3 border-b border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-green-600">₹{course.price.toFixed(2)}</span>
                      </div>
                      {stat && (
                        <>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Purchases:</span>
                            <span className="font-semibold text-purple-600">{stat.totalPurchases}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Revenue:</span>
                            <span className="font-semibold text-green-600">₹{stat.totalRevenue.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      Published: {new Date(course.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">No courses yet</p>
            <Link to="/teacher/courses" className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2 inline-block transition-all duration-300 ease-in-out">
              Create your first course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}