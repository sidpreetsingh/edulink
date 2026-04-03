import CourseModel from "../models/courses.js";
import UserModel from "../models/user.js";
import PurchaseModel from "../models/purchases.js";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalTeachers = await UserModel.countDocuments({ role: "teacher" });
    const totalCourses = await CourseModel.countDocuments();
    const totalPurchases = await PurchaseModel.countDocuments();
    const activeCourses = await CourseModel.countDocuments({ status: "active" });
    const archivedCourses = await CourseModel.countDocuments({ status: "archived" });

    const totalRevenueAgg = await PurchaseModel.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Recent purchases (last 5)
    const recentPurchases = await PurchaseModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name")
      .populate("courseId", "title")
      .lean();

    const recentPurchasesFormatted = recentPurchases.map((p) => ({
      _id: p._id,
      userName: p.userId.name,
      courseTitle: p.courseId.title,
      price: p.price,
      createdAt: p.createdAt,
    }));

    res.json({
      totalUsers,
      totalTeachers,
      totalCourses,
      totalPurchases,
      totalRevenue,
      recentPurchases: recentPurchasesFormatted,
      activeCourses,
      archivedCourses
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllCoursesAdmin = asyncWrapper(async (req, res) => {
    const courses = await CourseModel.find()
      .populate("teacherId", "name")
      .lean();

    
  
    res.status(200).json({
      success: true,
      data: courses
    });
  });