import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Trash2, Users, Mail, Calendar, Eye, X, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  purchasedCourses?: {
    _id: string;
    title: string;
    price: number;
    createdAt: string;
  }[];
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<string>("student");
  const [changingRole, setChangingRole] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      const usersData = res.data?.data || [];
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleting(userId);
      await api.delete(`/admin/users/${userId}`);
      
      setUsers(users.filter(u => u._id !== userId));
      toast.success("User deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const handleViewCourses = async (user: User) => {
    try {
      const res = await api.get(`/admin/purchases/${user._id}`);
      const purchasesData = res.data?.data || [];
      const userWithCourses = { 
        ...user, 
        purchasedCourses: purchasesData.map((p: any) => ({
          _id: p._id,
          title: p.courseId?.title || "Unknown Course",
          price: p.price,
          createdAt: p.createdAt
        }))
      };
      setSelectedUser(userWithCourses);
      setShowCoursesModal(true);
    } catch (err) {
      console.error("Error fetching user courses:", err);
      toast.error("Failed to load user courses");
    }
  };

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleChangeRole = async () => {
    if (!selectedUser) return;
    
    if (newRole === selectedUser.role) {
      toast.error("New role is the same as current role");
      return;
    }

    try {
      setChangingRole(selectedUser._id);
      await api.patch(`/admin/users/${selectedUser._id}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(u => 
        u._id === selectedUser._id 
          ? { ...u, role: newRole }
          : u
      ));
      
      toast.success(`Role changed to ${newRole} successfully!`);
      setShowRoleModal(false);
    } catch (err: any) {
      console.error("Error changing role:", err);
      toast.error(err.response?.data?.message || "Failed to change role");
    } finally {
      setChangingRole(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalStudents = users.filter(u => u.role === "student").length;
  const totalTeachers = users.filter(u => u.role === "teacher").length;
  const totalAdmins = users.filter(u => u.role === "admin").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-600 mt-2">View, manage, and delete users from your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Total Users</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{users.length}</h2>
          <p className="text-xs text-gray-500">All registered users</p>
        </div>

        {/* Students */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Students</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{totalStudents}</h2>
          <p className="text-xs text-gray-500">Active learners</p>
        </div>

        {/* Teachers */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Teachers</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{totalTeachers}</h2>
          <p className="text-xs text-gray-500">Active instructors</p>
        </div>

        {/* Admins */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Admins</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{totalAdmins}</h2>
          <p className="text-xs text-gray-500">Platform admins</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
        </div>

        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr 
                    key={user._id} 
                    className={`border-b border-gray-100 hover:bg-blue-50 transition-all duration-300 ease-in-out ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        user.role === "teacher"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "admin"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="text-blue-600 hover:text-blue-800 transition-all duration-300 ease-in-out font-semibold text-sm"
                          title="Change role"
                        >
                          Change Role
                        </button>
                        {user.role === "student" && (
                          <button
                            onClick={() => handleViewCourses(user)}
                            className="text-green-600 hover:text-green-800 transition-all duration-300 ease-in-out"
                            title="View purchased courses"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deleting === user._id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                          title="Delete user"
                        >
                          {deleting === user._id ? (
                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Users size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No users yet</p>
          </div>
        )}

        {/* Footer */}
        {users.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">{users.length}</span> users
            </p>
          </div>
        )}
      </div>

      {/* Courses Modal */}
      {showCoursesModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[70vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Purchased Courses</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedUser.name}</p>
              </div>
              <button
                onClick={() => setShowCoursesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {selectedUser.purchasedCourses && selectedUser.purchasedCourses.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.purchasedCourses.map((course) => (
                    <div key={course._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 ease-in-out">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-blue-600" />
                            <h4 className="font-semibold text-gray-900">{course.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {new Date(course.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-green-600">₹{course.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-semibold">No courses purchased yet</p>
                </div>
              )}
            </div>

            {selectedUser.purchasedCourses && selectedUser.purchasedCourses.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Total Courses: <span className="font-semibold">{selectedUser.purchasedCourses.length}</span> | 
                  Total Spent: <span className="font-semibold text-green-600">
                    ₹{selectedUser.purchasedCourses.reduce((sum, c) => sum + c.price, 0).toFixed(2)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Change User Role</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedUser.name}</p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Current Role</p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedUser.role === "teacher"
                      ? "bg-blue-100 text-blue-800"
                      : selectedUser.role === "admin"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Select New Role</p>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out">
                    <input
                      type="radio"
                      value="student"
                      checked={newRole === "student"}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-900 font-medium">Student</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out">
                    <input
                      type="radio"
                      value="teacher"
                      checked={newRole === "teacher"}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-900 font-medium">Teacher</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out">
                    <input
                      type="radio"
                      value="admin"
                      checked={newRole === "admin"}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-900 font-medium">Admin</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                disabled={changingRole === selectedUser._id}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 ease-in-out font-semibold disabled:opacity-50"
              >
                {changingRole === selectedUser._id ? "Changing..." : "Change Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}