import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { BookOpen, Edit2, Trash2, Plus, X, Archive, ArchiveRestore, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

type Course = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  published: boolean;
  status: "active" | "archived";
  teacherId: { _id: string; name: string };
  createdAt: string;
};

type Teacher = {
  _id: string;
  name: string;
  email: string;
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState<string | null>(null);
  const [archiving, setArchiving] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    createdBy: ""
  });

  // Fetch all courses
  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/admin/users?role=teacher");
      setTeachers(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("This will permanently delete the course and all related purchases. Continue?")) return;
    try {
      setDeleting(id);
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      toast.success("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error("Failed to delete course");
    } finally {
      setDeleting(null);
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      setPublishing(id);
      await api.patch(`/courses/${id}/publish`);
      setCourses(courses.map((c) => (c._id === id ? { ...c, published: !current } : c)));
      toast.success(`Course ${!current ? "published" : "unpublished"} successfully!`);
    } catch (err) {
      console.error("Error toggling publish:", err);
      toast.error("Failed to toggle publish status");
    } finally {
      setPublishing(null);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      setArchiving(id);
      const res = await api.patch(`/courses/${id}/status`);
      setCourses(courses.map((c) => (c._id === id ? res.data.data : c)));
      toast.success("Course status updated!");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update course status");
    } finally {
      setArchiving(null);
    }
  };

  // CREATE COURSE
  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.createdBy) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const res = await api.post("/courses", {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        createdBy: formData.createdBy
      });
      setCourses([res.data.data, ...courses]);
      setShowCreateModal(false);
      setFormData({ title: "", description: "", price: "", createdBy: "" });
      toast.success("Course created successfully!");
    } catch (err: any) {
      console.error("Error creating course:", err);
      toast.error(err.response?.data?.message || "Failed to create course");
    }
  };

    // OPEN EDIT MODAL
    const openEditModal = (course: Course) => {
      setEditCourse(course);
      setFormData({
        title: course.title,
        description: course.description || "",
        price: course.price.toString(),
        createdBy: course.teacherId?._id || ""
      });
      setShowEditModal(true);
    };

  // EDIT COURSE
    // EDIT COURSE
    const handleEdit = async () => {
      if (!editCourse) return;
      if (!formData.title || !formData.description || !formData.price) {
        toast.error("Please fill all required fields");
        return;
      }
      try {
        const res = await api.patch(`/courses/${editCourse._id}`, {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price)
        });
        setCourses(courses.map((c) => (c._id === editCourse._id ? res.data.data : c)));
        setShowEditModal(false);
        setEditCourse(null);
        setFormData({ title: "", description: "", price: "", createdBy: "" });
        toast.success("Course updated successfully!");
      } catch (err: any) {
        console.error("Error editing course:", err);
        toast.error(err.response?.data?.message || "Failed to update course");
      }
    };

  const activeCourses = courses.filter((c) => c.status === "active");
  const archivedCourses = courses.filter((c) => c.status === "archived");
  const publishedCourses = courses.filter((c) => c.published).length;

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-600 mt-2">View and manage all courses on the platform</p>
        </div>
        <button
          onClick={() => {
            setFormData({ title: "", description: "", price: "", createdBy: "" });
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out font-semibold shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Create Course
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Total Courses</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{courses.length}</h2>
          <p className="text-xs text-gray-500">All courses</p>
        </div>

        {/* Active Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Active Courses</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeCourses.length}</h2>
          <p className="text-xs text-gray-500">Visible courses</p>
        </div>

        {/* Published Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Published</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{publishedCourses}</h2>
          <p className="text-xs text-gray-500">Available to students</p>
        </div>

        {/* Archived Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Archive size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Archived</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{archivedCourses.length}</h2>
          <p className="text-xs text-gray-500">Hidden courses</p>
        </div>
      </div>

      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-500 ease-in-out overflow-hidden flex flex-col">
                {/* Course Image */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={48} />
                      <p className="text-sm mt-2">No image</p>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1">{course.title}</h3>
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">by {course.teacherId?.name || "Unknown"}</p>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{course.description}</p>

                  <div className="py-4 border-t border-gray-200 mb-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Price</span>
                      <span className="font-bold text-green-600 text-lg">₹{course.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Status</span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        course.published ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {course.published ? "Published" : "Unpublished"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => togglePublish(course._id, course.published)}
                      disabled={publishing === course._id}
                      className="flex-1 flex items-center justify-center gap-2 text-purple-600 hover:text-purple-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-purple-50 disabled:opacity-50"
                      title={course.published ? "Unpublish" : "Publish"}
                    >
                      {publishing === course._id ? (
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      ) : course.published ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                      {course.published ? "Unpub" : "Pub"}
                    </button>
                    <button
                      onClick={() => handleArchive(course._id)}
                      disabled={archiving === course._id}
                      className="flex-1 flex items-center justify-center gap-2 text-orange-600 hover:text-orange-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-orange-50 disabled:opacity-50"
                      title="Archive"
                    >
                      {archiving === course._id ? (
                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Archive size={18} />
                      )}
                      Archive
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      disabled={deleting === course._id}
                      className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-red-50 disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === course._id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Archived Courses */}
      {archivedCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Archived Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedCourses.map((course) => (
              <div key={course._id} className="bg-gray-50 rounded-xl shadow-sm border border-gray-300 hover:shadow-lg transition-all duration-500 ease-in-out overflow-hidden opacity-75 flex flex-col">
                {/* Course Image */}
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-60" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={48} />
                      <p className="text-sm mt-2">No image</p>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1">{course.title}</h3>
                      <span className="inline-block bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                        Archived
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">by {course.teacherId?.name || "Unknown"}</p>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{course.description}</p>

                  <div className="py-4 border-t border-gray-300 mb-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Price</span>
                      <span className="font-bold text-gray-600 text-lg">₹{course.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Status</span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        course.published ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {course.published ? "Published" : "Unpublished"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleArchive(course._id)}
                      disabled={archiving === course._id}
                      className="flex-1 flex items-center justify-center gap-2 text-green-600 hover:text-green-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-green-50 disabled:opacity-50"
                      title="Restore"
                    >
                      {archiving === course._id ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ArchiveRestore size={18} />
                      )}
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      disabled={deleting === course._id}
                      className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-red-50 disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === course._id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold text-lg">No courses yet</p>
          <p className="text-gray-400 text-sm mt-2 mb-6">Get started by creating your first course</p>
          <button
            onClick={() => {
              setFormData({ title: "", description: "", price: "", createdBy: "" });
              setShowCreateModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Create your first course
          </button>
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Create New Course</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* CreatedBy Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Teacher ID (createdBy) *</label>
                <input
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="Enter teacher ID"
                />
                <p className="text-xs text-gray-500 mt-1">Paste the teacher's user ID here</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="Enter course title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="Enter course description"
                  rows={4}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 sticky bottom-0">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Edit Course Modal */}
            {showEditModal && editCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Edit Course</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="Enter course title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="Enter course description"
                  rows={4}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 sticky bottom-0">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out font-semibold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}