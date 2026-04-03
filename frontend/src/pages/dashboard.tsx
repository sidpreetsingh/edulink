import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { usePurchasesStore } from "../store/purchasedStore";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import welcomeSvg from "../assets/undraw_online-learning_tgmv.svg";

export type Course2 = {
    _id: string;
    title: string;
    description?: string;
    price: number;
    image?: string;
    published: boolean;
    teacherId?: { _id: string; name: string };
};

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const purchasedCourses = usePurchasesStore(
    (state) => state.purchasedCourses
  );
  const fetchPurchasedCourses = usePurchasesStore(
    (state) => state.fetchPurchasedCourses
  );

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchPurchasedCourses();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchPurchasedCourses]);

  // Debug: Log the data to see what structure we're getting
  useEffect(() => {
    if (purchasedCourses.length > 0) {
      console.log("Purchased courses:", purchasedCourses);
      console.log("First course:", purchasedCourses[0].courseId);
    }
  }, [purchasedCourses]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between gap-12">
          {/* Left - Welcome Text */}
          <div className="flex-1 space-y-3">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Welcome back</p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              {user?.name || "User"}
            </h1>
            <p className="text-gray-600 text-lg">
              You have {purchasedCourses.length} course{purchasedCourses.length !== 1 ? "s" : ""} in progress. Keep learning and growing!
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
            >
              <BookOpen size={20} />
              Explore More Courses
            </button>
          </div>

          {/* Right - SVG */}
          <div className="flex-1 hidden lg:flex items-center justify-center">
            <img src={welcomeSvg} alt="welcome" className="w-80 h-80 object-contain" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Courses Enrolled</p>
              <p className="text-5xl font-bold text-gray-900 mt-2">{purchasedCourses.length}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <BookOpen size={32} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Your Courses Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Courses</h2>
            <p className="text-gray-600 mt-2">Continue learning from where you left off</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : purchasedCourses.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-gray-100 rounded-full">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-lg">No Courses Yet</p>
                <p className="text-gray-600 mt-1">You haven't enrolled in any courses yet. Start learning today!</p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold inline-block"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedCourses.map((p) => {
                const course = p.courseId as any;
                
                // Handle teacherId whether it's a string or object
                let teacherId = { _id: "", name: "Unknown" };
                if (course?.teacherId) {
                  if (typeof course.teacherId === "string") {
                    teacherId = { _id: course.teacherId, name: course.teacherName || "Unknown" };
                  } else if (typeof course.teacherId === "object") {
                    teacherId = {
                      _id: course.teacherId._id || course.teacherId,
                      name: course.teacherId.name || "Unknown"
                    };
                  }
                }

                return (
                  <CourseCard 
                    key={p._id} 
                    course={{
                      _id: course?._id || "",
                      title: course?.title || "Untitled",
                      description: course?.description || "",
                      price: course?.price || 0,
                      image: course?.image,
                      published: course?.published || false,
                      teacherId
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}