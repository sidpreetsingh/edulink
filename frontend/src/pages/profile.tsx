import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { api } from "../api/axios";
import ChangePassword from "../components/changePassword";
import toast from "react-hot-toast";
import { Edit2, Check, X } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(user);

  // Fetch fresh user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/users/my-profile");
        
        // Handle different response structures
        const fetchedUser = res.data?.user || res.data?.data || res.data;
        
        if (fetchedUser && fetchedUser.name) {
          setUserData(fetchedUser);
          setUser(fetchedUser);
          setName(fetchedUser.name);
          setEmail(fetchedUser.email);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        // Keep using the store user if fetch fails
      }
    };

    if (user) {
      fetchUserData();
    }
  }, []);

  if (!user) {
    return (
      <div className="text-center text-gray-500 py-20">
        Please login to view your profile.
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);

      const res = await api.patch("users/my-profile", formData);

      const updatedUser = res.data?.user || res.data?.data || res.data;
      
      setUserData(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const displayUser = userData || user;

  return (
    <div className="min-h-[70vh] py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
              {getInitials(displayUser.name)}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800">{displayUser.name}</h1>
              <p className="text-gray-500 mt-2">{displayUser.email}</p>
              <div className="mt-4 inline-block">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-semibold capitalize border border-blue-200">
                  {displayUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Account Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                )}
              </div>

              {!isEditing ? (
                // View Mode
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-200">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Full Name</p>
                    <p className="text-gray-800 text-lg font-semibold">{displayUser.name}</p>
                  </div>
                  <div className="pb-6 border-b border-gray-200">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</p>
                    <p className="text-gray-800 text-lg font-semibold">{displayUser.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Account Type</p>
                    <p className="text-gray-800 text-lg font-semibold capitalize">{displayUser.role}</p>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-gray-800"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-gray-800"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold disabled:opacity-50"
                    >
                      <Check size={18} />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setName(displayUser.name);
                        setEmail(displayUser.email);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Security */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Security</h3>
              <ChangePassword />

              <div className="pt-6 mt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                  Member Since
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {displayUser.createdAt 
                    ? new Date(displayUser.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}