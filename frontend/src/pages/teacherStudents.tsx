import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Users, Mail, BookOpen, Calendar, Eye, X } from "lucide-react";
import toast from "react-hot-toast";

type Student = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  courseId: {
    _id: string;
    title: string;
  };
  purchaseDate: string;
};

export default function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const enrollmentsRes = await api.get("/purchases/enrollments");
      const enrollments = enrollmentsRes.data?.data || [];
  
      const formattedEnrollments = enrollments.map((enrollment: any) => ({
        _id: enrollment._id,
        userId: enrollment.userId,
        courseId: {
          _id: enrollment.courseId._id,
          title: enrollment.courseId.title
        },
        purchaseDate: enrollment.createdAt
      }));
  
      setStudents(formattedEnrollments);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const uniqueStudents = Array.from(
    new Map(students.map(s => [s.userId._id, s])).values()
  );

  const totalCourses = new Set(students.map(s => s.courseId._id)).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-600 mt-2">View and manage students enrolled in your courses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Total Students</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{uniqueStudents.length}</h2>
          <p className="text-xs text-gray-500">Active learners</p>
        </div>

        {/* Total Enrollments */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Enrollments</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{students.length}</h2>
          <p className="text-xs text-gray-500">Total course enrollments</p>
        </div>

        {/* Unique Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Your Courses</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{totalCourses}</h2>
          <p className="text-xs text-gray-500">Active courses</p>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Student List</h2>
        </div>

        {uniqueStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Enrolled</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {uniqueStudents.map((student, idx) => {
                  const studentCourses = students.filter(s => s.userId._id === student.userId._id);
                  return (
                    <tr 
                      key={student.userId._id} 
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-all duration-300 ease-in-out ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{student.userId.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{student.userId.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {studentCourses.length}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm">
                          {new Date(studentCourses[0]?.purchaseDate || student.purchaseDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewStudent(student)}
                          className="text-blue-600 hover:text-blue-800 transition-all duration-300 ease-in-out font-semibold text-sm flex items-center gap-2"
                        >
                          <Eye size={18} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Users size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No students yet</p>
          </div>
        )}

        {/* Footer */}
        {uniqueStudents.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">{uniqueStudents.length}</span> students | 
              Enrollments: <span className="font-semibold">{students.length}</span>
            </p>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Student Details</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedStudent.userId.name}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Name */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1 font-semibold uppercase tracking-wider">Name</p>
                <p className="font-semibold text-gray-900">{selectedStudent.userId.name}</p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1 font-semibold uppercase tracking-wider flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </p>
                <p className="font-semibold text-gray-900">{selectedStudent.userId.email}</p>
              </div>

              {/* Enrolled Courses */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3 font-semibold uppercase tracking-wider flex items-center gap-2">
                  <BookOpen size={16} />
                  Enrolled Courses
                </p>
                <div className="space-y-2">
                  {students
                    .filter(s => s.userId._id === selectedStudent.userId._id)
                    .map((enrollment, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 p-3 rounded hover:shadow-md transition-all duration-300 ease-in-out">
                        <p className="font-medium text-gray-900 text-sm">{enrollment.courseId.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(enrollment.purchaseDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}