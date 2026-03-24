const CourseModel = require("../models/courses");
const PurchaseModel = require("../models/purchases");
const { AppError } = require("../utilities/appError");
const { asyncWrapper } = require("../middlewares/asyncWrapper");
const UserModel = require("../models/user");

exports.createPurchase = asyncWrapper(async (req, res) => {
    const { courseId } = req.params;
    const course = await CourseModel.findById(courseId);

    if (!course) {
        throw new AppError("Course not found!!!", 404);
    }

    if (!course.published) {
        throw new AppError("Course not published yet!!!", 403);
    }

    if (course.teacherId.toString() === req.user.id) {
        throw new AppError("You can't purchase your own course!!!", 400);
    }

    try {
        const purchase = await PurchaseModel.create({
            userId: req.user.id,
            courseId,
            price: course.price
        });

        res.status(201).json({
            success: true,
            message: "Purchase Successful",
            data: purchase
        });
    } catch (err) {
        if (err.code === 11000) {
            throw new AppError("Course already purchased!!!", 400);
        }
        throw err;
    }
});

exports.purchasedCourses = asyncWrapper(async (req, res) => {
    const userId = req.user.id;

    const purchases = await PurchaseModel.find({ userId: userId })
        .populate('courseId', 'title description price image')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: purchases,
        count: purchases.length
    });
});

exports.getEnrollments = asyncWrapper(async (req, res) => {
    const { courseId } = req.params;

    const course = await CourseModel.findById(courseId);

    if (!course) {
        throw new AppError("The course doesn't exist only!!", 404);
    }

    if (course.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new AppError("Not authorized to access!!", 403);
    }

    const enrollments = await PurchaseModel.find({ courseId: courseId })
        .populate('userId', 'name email')
        .select('-courseId');

    res.status(200).json({
        success: true,
        data: enrollments,
        count: enrollments.length
    });
});

exports.checkPurchases = asyncWrapper(async (req, res) => {
    const { courseId } = req.params;

    const purchase = await PurchaseModel.findOne({
        userId: req.user.id,
        courseId
    });

    res.status(200).json({
        success: true,
        purchased: !!purchase
    });
});

//admin-specific-function now!!

exports.getPurchasesOfUser = asyncWrapper(async (req, res) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const purchases = await PurchaseModel.find({ userId })
        .populate('courseId', 'title price')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: purchases.length,
        data: purchases
    });
});

exports.getAllPurchases = asyncWrapper(async (req, res) => {
    const purchases = await PurchaseModel.find()
        .populate('userId', 'name email')
        .populate('courseId', 'title price')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: purchases
    });
});

exports.deletePurchase = asyncWrapper(async (req, res) => {
    const { purchId } = req.params;

    const purchase = await PurchaseModel.findById(purchId);

    if (!purchase) {
        throw new AppError("Purchase Not Found!!", 404);
    }

    await purchase.deleteOne();

    res.status(200).json({
        success: true,
        message: "Deleted successfully"
    });
});
