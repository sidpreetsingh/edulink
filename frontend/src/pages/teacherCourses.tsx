import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { BookOpen, Edit2, Trash2, Plus, X, Archive, ArchiveRestore, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  status: "active" | "archived";
  createdAt: string;
};

export default function TeacherCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [archiving, setArchiving] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: ""
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/teacher");
      const coursesData = res.data?.data || [];
      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedCourse(null);
    setIsEditing(false);
    setImagePreview("");
    setFormData({
      title: "",
      description: "",
      price: "",
      image: ""
    });
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setSelectedCourse(course);
    setIsEditing(true);
    setImagePreview(course.image || "");
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price.toString(),
      image: course.image || ""
    });
    setShowCreateModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCourse = async () => {
    if (!formData.title || !formData.description || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        ...(formData.image && { image: formData.image })
      };

      if (isEditing && selectedCourse) {
        await api.patch(`/courses/${selectedCourse._id}`, data);
        setCourses(courses.map(c =>
          c._id === selectedCourse._id
            ? { ...c, ...data }
            : c
        ));
        toast.success("Course updated successfully!");
      } else {
        const res = await api.post("/courses", data);
        setCourses([...courses, res.data?.data]);
        toast.success("Course created successfully!");
      }
      setShowCreateModal(false);
    } catch (err: any) {
      console.error("Error saving course:", err);
      toast.error(err.response?.data?.message || "Failed to save course");
    }
  };

  const handleToggleArchive = async (course: Course) => {
    const newStatus = course.status === "active" ? "archived" : "active";
    const message = newStatus === "archived" 
      ? "Are you sure you want to archive this course?" 
      : "Are you sure you want to restore this course?";

    if (!window.confirm(message)) {
      return;
    }

    try {
      setArchiving(course._id);
      await api.patch(`/courses/${course._id}/status`, { status: newStatus });
      setCourses(courses.map(c =>
        c._id === course._id
          ? { ...c, status: newStatus }
          : c
      ));
      toast.success(`Course ${newStatus === "archived" ? "archived" : "restored"} successfully!`);
    } catch (err: any) {
      console.error("Error toggling archive:", err);
      toast.error(err.response?.data?.message || "Failed to toggle course status");
    } finally {
      setArchiving(null);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course and all related purchases?")) {
      return;
    }

    try {
      setDeleting(courseId);
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c._id !== courseId));
      toast.success("Course deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting course:", err);
      toast.error(err.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleting(null);
    }
  };

  const activeCourses = courses.filter(c => c.status === "active");
  const archivedCourses = courses.filter(c => c.status === "archived");

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Manage and organize your courses</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out font-semibold shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Create Course
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Active Courses</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeCourses.length}</h2>
          <p className="text-xs text-gray-500">Published and visible</p>
        </div>

        {/* Archived Courses */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Archive size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Archived Courses</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{archivedCourses.length}</h2>
          <p className="text-xs text-gray-500">Hidden from students</p>
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

                {/* Course Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2">{course.title}</h3>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{course.description}</p>

                  <div className="py-4 border-t border-gray-200 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-semibold">Price</span>
                      <span className="font-bold text-green-600 text-lg">₹{course.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(course)}
                      className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-blue-50"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleArchive(course)}
                      disabled={archiving === course._id}
                      className="flex-1 flex items-center justify-center gap-2 text-orange-600 hover:text-orange-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-orange-50 disabled:opacity-50"
                    >
                      {archiving === course._id ? (
                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Archive size={16} />
                      )}
                      Archive
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      disabled={deleting === course._id}
                      className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === course._id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={16} />
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

                {/* Course Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2">{course.title}</h3>
                    <span className="inline-block bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Archived
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{course.description}</p>

                  <div className="py-4 border-t border-gray-300 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-semibold">Price</span>
                      <span className="font-bold text-gray-600 text-lg">₹{course.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleArchive(course)}
                      disabled={archiving === course._id}
                      className="flex-1 flex items-center justify-center gap-2 text-green-600 hover:text-green-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-green-50 disabled:opacity-50"
                    >
                      {archiving === course._id ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ArchiveRestore size={16} />
                      )}
                      Restore
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      disabled={deleting === course._id}
                      className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-all duration-300 ease-in-out py-2 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === course._id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={16} />
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
            onClick={handleOpenCreateModal}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Create your first course
          </button>
        </div>
      )}

      {/* Create/Edit Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Course" : "Create New Course"}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Image</label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-gray-300" />
                      <button
                        onClick={() => {
                          setImagePreview("");
                          setFormData({ ...formData, image: "" });
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-lg hover:bg-red-700 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 ease-in-out">
                      <div className="text-center">
                        <ImageIcon size={32} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload image</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter course title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                onClick={handleSaveCourse}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out font-semibold"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}