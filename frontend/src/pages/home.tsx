import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicCoursesStore } from "../store/publicCoursesStore";
import CourseCard from "../components/CourseCard";
import heroImage from "../assets/undraw_online-learning_tgmv.svg";
import qualityIcon from "../assets/undraw_cli-coding-agent_jtq1.svg";
import speedIcon from "../assets/undraw_empty-wallet_j0kn.svg";
import growthIcon from "../assets/undraw_project-complete_1zw5.svg";

export default function Home(){
    const navigate = useNavigate();
    const courses=usePublicCoursesStore((state)=>state.courses);
    const fetchCourses=usePublicCoursesStore((state)=>state.fetchCourses);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const loadData = async () => {
            try {
                await fetchCourses();
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    },[fetchCourses]);

    const featuredCourses = courses.slice(0, 3);

    return (
        <div className="space-y-10">
          
          {/* Intro Section */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-10 px-20 py-10">
            {/* Left Text */}
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
                Learn Smarter with <span className="text-blue-600">EduLink</span>
              </h1>

              <p className="text-gray-600 text-lg">
                Explore high-quality courses designed to help you grow your skills, build real projects, and achieve your goals faster.
              </p>

              <button 
                onClick={() => navigate("/courses")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md font-semibold"
              >
                Explore Courses
              </button>
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center">
              <img
                src={heroImage}
                alt="learning illustration"
                className="w-[350px] md:w-[450px]"
              />
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-12">
              Why Choose <span className="text-blue-600">EduLink</span>?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Reason 1 */}
              <div className="flex flex-col items-center space-y-4">
                <img src={qualityIcon} alt="quality" className="w-45 h-45" />
                <h3 className="text-xl font-semibold text-gray-800">Quality Content</h3>
                <p className="text-gray-600 text-sm max-w-xs">
                  Learn from well-structured, high-quality courses designed for real understanding.
                </p>
              </div>

              {/* Reason 2 */}
              <div className="flex flex-col items-center space-y-4">
                <img src={speedIcon} alt="speed" className="w-45 h-45" />
                <h3 className="text-xl font-semibold text-gray-800">Fast & Practical</h3>
                <p className="text-gray-600 text-sm max-w-xs">
                  Focus on hands-on learning with real projects that build your skills quickly.
                </p>
              </div>

              {/* Reason 3 */}
              <div className="flex flex-col items-center space-y-4">
                <img src={growthIcon} alt="growth" className="w-45 h-45" />
                <h3 className="text-xl font-semibold text-gray-800">Career Growth</h3>
                <p className="text-gray-600 text-sm max-w-xs">
                  Gain skills that help you grow faster and stand out in your career.
                </p>
              </div>
            </div>
          </section>

          {/* Featured Courses */}
          <section className="px-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
              <button
                onClick={() => navigate("/courses")}
                className="text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : featuredCourses.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 font-semibold">No featured courses available yet.</p>
                </div>
              ) : (
                featuredCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))
              )}
            </div>
          </section>

        </div>
      );
    }