const CourseModel = require("../models/courses")

const { AppError } = require("../utilities/appError");
const { asyncWrapper } = require("../middlewares/asyncWrapper");

exports.allCoursesPublic = asyncWrapper(async (req, res) => {
    const courses = await CourseModel.find({ published: true,status:"active" })
        .populate('teacherId', 'name');

    res.status(200).json({
        success: true,
        length: courses.length,
        data: courses
    });
});

exports.viewCoursePublic = asyncWrapper(async (req, res) => {
    const { courseId } = req.params;

    const course = await CourseModel.findOne({
        _id: courseId,
        published: true,
        status:"active"
    }).populate('teacherId', 'name');

    if (!course) {
        throw new AppError("Course not found!!!", 404);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});