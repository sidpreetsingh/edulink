import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../services/coursesService";
import type { Course } from "../store/publicCoursesStore";
import { useAuthStore } from "../store/authStore";
import { usePurchasesStore } from "../store/purchasedStore";
import { BookOpen, ShoppingCart, Check, ArrowLeft, Star, Users, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [courseLoding, setCourseLoading] = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [buyingLoading, setBuyingLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  const purchasedCourses = usePurchasesStore((state) => state.purchasedCourses);
  const buyCourse = usePurchasesStore((state) => state.buyCourse);
  const fetchPurchasedCourses = usePurchasesStore(
    (state) => state.fetchPurchasedCourses
  );

  // Load purchases
  useEffect(() => {
    const loadPurchases = async () => {
      setLoadingPurchases(true);

      if (user) {
        try {
          await fetchPurchasedCourses();
        } finally {
          setLoadingPurchases(false);
        }
      } else {
        setLoadingPurchases(false);
      }
    };

    if (!authLoading) {
      loadPurchases();
    }
  }, [user, fetchPurchasedCourses, authLoading]);

  // Load course
  useEffect(() => {
    if (courseId) {
      setCourseLoading(true);
      getCourseById(courseId)
        .then((data) => {
          setCourse(data);
          setCourseLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load course");
          setCourseLoading(false);
        });
    }
  }, [courseId]);

  const alreadyPurchased =
    !loadingPurchases &&
    purchasedCourses.some(
      (p) => p.courseId && p.courseId._id === courseId
    );

  async function handleBuy() {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    if (alreadyPurchased) {
      toast.success("You already own this course!");
      return;
    }

    try {
      setBuyingLoading(true);
      await buyCourse(courseId!);
      await fetchPurchasedCourses();
      toast.success("Course purchased successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to purchase course");
    } finally {
      setBuyingLoading(false);
    }
  }

  if (courseLoding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <BookOpen size={48} className="text-gray-300" />
        <p className="text-gray-600 font-semibold">Course not found</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>

      {/* Hero Section with Image */}
      <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
        {course.image ? (
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen size={128} className="text-white opacity-30" />
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Status */}
            <div>
              <div className="flex items-start justify-between mb-4 gap-4">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {course.title}
                </h1>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${alreadyPurchased ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                  {alreadyPurchased ? "✓ Purchased" : course.published ? "Available" : "Coming Soon"}
                </span>
              </div>

              {/* Instructor */}
              <p className="text-gray-600 text-lg mb-4">
                Taught by <span className="font-semibold text-gray-900">{course.teacherId?.name || "Unknown"}</span>
              </p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-700 leading-relaxed">
                {course.description || "No description available"}
              </p>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 sticky top-24 space-y-6">
              {/* Price */}
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">COURSE PRICE</p>
                <div className="text-4xl font-bold text-gray-900">
                  ₹{course.price.toFixed(2)}
                </div>
              </div>

              {/* CTA Button */}
              {!authLoading && !loadingPurchases && !alreadyPurchased ? (
                <button
                  onClick={handleBuy}
                  disabled={buyingLoading || !course.published}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buyingLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : !course.published ? (
                    "Coming Soon"
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Enroll Now
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full bg-green-50 text-green-700 py-3 px-6 rounded-lg border border-green-200 font-semibold text-lg flex items-center justify-center gap-2">
                  <Check size={20} />
                  Already Enrolled
                </div>
              )}

              {/* Additional Info */}
              <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p>30-day money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}