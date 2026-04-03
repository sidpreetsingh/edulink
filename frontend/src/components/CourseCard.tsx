import { useNavigate } from "react-router-dom";
import type { Course } from "../store/publicCoursesStore";
import { useAuthStore } from "../store/authStore";
import { usePurchasesStore } from "../store/purchasedStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen, ShoppingCart, Check } from "lucide-react";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const purchasedCourses = usePurchasesStore((state) => state.purchasedCourses);
  const fetchPurchasedCourses = usePurchasesStore(
    (state) => state.fetchPurchasedCourses
  );
  const buyCourse = usePurchasesStore((state) => state.buyCourse);

  const [purchasesLoaded, setPurchasesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch purchased courses when user changes
  useEffect(() => {
    if (user) {
      fetchPurchasedCourses().finally(() => setPurchasesLoaded(true));
    } else {
      setPurchasesLoaded(true);
    }
  }, [user, fetchPurchasedCourses]);

  const alreadyPurchased = purchasesLoaded
    ? purchasedCourses.some(
        (p) => p.courseId && p.courseId._id === course?._id
      )
    : false;

    async function handleBuy() {
      if (!user) {
        toast.error("Please login first!");
        return;
      }
    
      try {
        setLoading(true);
    
        await buyCourse(course._id);
    
        // Refetch purchases so UI updates instantly
        await fetchPurchasedCourses();
        
        // Only show success after successful purchase AND refetch
        toast.success("Course purchased successfully!");
      } catch (err: any) {
        console.error("Purchase error:", err);
        
        // Show the actual error message from backend
        const errorMessage = err?.response?.data?.message || "Something went wrong while purchasing";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden flex flex-col">
      {/* Course Image */}
      <div className="w-full h-56 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
        {course.image ? (
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen size={64} className="text-white opacity-50" />
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h2 className="font-semibold text-gray-900 text-base line-clamp-2 flex-1">
              {course.title}
            </h2>
            <span className={`inline-block text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${alreadyPurchased ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
              {alreadyPurchased ? "Purchased" : "Available"}
            </span>
          </div>
          <p className="text-xs text-gray-500">by {course.teacherId?.name || "Unknown"}</p>
        </div>

        {course.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
            {course.description}
          </p>
        )}

        <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-green-600 text-lg">₹{course.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Instructor:</span>
            <span className="font-medium text-gray-900">{course.teacherId?.name || "N/A"}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/courses/${course._id}`)}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold text-sm"
          >
            View Details
          </button>

          {purchasesLoaded && !alreadyPurchased ? (
            <button
              onClick={handleBuy}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Buying...
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Buy Now
                </>
              )}
            </button>
          ) : (
            <div className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm font-semibold gap-2">
              <Check size={18} />
              Purchased
            </div>
          )}
        </div>
      </div>
    </div>
  );
}