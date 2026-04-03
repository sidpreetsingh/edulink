import { useEffect } from "react";
import { usePublicCoursesStore } from "../store/publicCoursesStore";
import CourseCard from "../components/CourseCard";

export default function Courses(){
    const courses=usePublicCoursesStore((state)=>state.courses);
    const fetchCourses=usePublicCoursesStore((state)=>state.fetchCourses);

    useEffect(()=>{
        fetchCourses();
    },[fetchCourses]);

    return(
        <div className="space-y-6 px-20">
            <h1 className="text-3xl font-bold text-center">All Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.length===0 ? (
                    <p className="col-span-full text-center">No Courses Available</p>
                ):(
                    courses.map((course)=><CourseCard key={course._id} course={course}/>)
                )}
            </div>
        </div>
    )}