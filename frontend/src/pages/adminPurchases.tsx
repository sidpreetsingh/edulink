import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { DollarSign, ShoppingCart, Users, TrendingUp, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type Purchase = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  courseId: {
    _id: string;
    title: string;
    price: number;
  };
  price: number;
  status: string;
  createdAt: string;
};

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await api.get("/admin/purchases");
      const purchasesData = res.data?.data || [];
      setPurchases(purchasesData);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setPurchases([]);
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePurchase = async (purchaseId: string) => {
    if (!window.confirm("Are you sure you want to delete this purchase? Status will be marked as refunded.")) {
      return;
    }

    try {
      setDeleting(purchaseId);
      await api.delete(`/admin/purchases/${purchaseId}`);
      
      // Update local state - mark as refunded
      setPurchases(purchases.map(p => 
        p._id === purchaseId 
          ? { ...p, status: "refunded" }
          : p
      ));
      
      toast.success("Purchase refunded successfully!");
    } catch (err: any) {
      console.error("Error deleting purchase:", err);
      toast.error(err.response?.data?.message || "Failed to delete purchase");
    } finally {
      setDeleting(null);
    }
  };

  // Calculate stats
  const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0);
  const totalPurchases = purchases.length;
  const uniqueStudents = new Set(purchases.map(p => p.userId._id)).size;
  const avgPurchaseValue = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;

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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Purchase Analytics</h1>
        <p className="text-gray-600 mt-2">Manage all course purchases and refunds</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">₹{totalRevenue.toFixed(2)}</h2>
          <p className="text-xs text-gray-500">All course sales</p>
        </div>

        {/* Total Purchases */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Total Purchases</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{totalPurchases}</h2>
          <p className="text-xs text-gray-500">Course enrollments</p>
        </div>

        {/* Unique Students */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Active Students</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{uniqueStudents}</h2>
          <p className="text-xs text-gray-500">Enrolled learners</p>
        </div>

        {/* Avg Purchase Value */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp size={20} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Average Value</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">₹{avgPurchaseValue.toFixed(2)}</h2>
          <p className="text-xs text-gray-500">Per purchase</p>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Purchases</h2>
        </div>

        {purchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, idx) => (
                  <tr 
                    key={purchase._id} 
                    className={`border-b border-gray-100 hover:bg-blue-50 transition-all duration-300 ease-in-out ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{purchase.userId.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{purchase.userId.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{purchase.courseId.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-green-600">₹{purchase.price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-sm">
                        {new Date(purchase.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        purchase.status === "refunded"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {purchase.status === "refunded" ? "Refunded" : "Completed"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeletePurchase(purchase._id)}
                        disabled={deleting === purchase._id || purchase.status === "refunded"}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                        title={purchase.status === "refunded" ? "Already refunded" : "Delete and refund"}
                      >
                        {deleting === purchase._id ? (
                          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <ShoppingCart size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">No purchases yet</p>
          </div>
        )}

        {/* Footer */}
        {purchases.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">{purchases.length}</span> purchases | 
              Revenue: <span className="font-semibold text-green-600">₹{totalRevenue.toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}