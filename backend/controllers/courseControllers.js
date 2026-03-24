const CourseModel = require("../models/courses");
const UserModel=require("../models/user");
const { AppError } = require("../utilities/appError");
const { asyncWrapper } = require("../middlewares/asyncWrapper");

exports.createCourse = asyncWrapper(async (req, res) => {
    const { title, description, price, createdBy } = req.body;

    if (!title || !description || !price) {
        throw new AppError("Please enter all the fields!!", 400);
    }

    let teacherId;

    const teacher = await UserModel.findById(createdBy);
    if (!teacher) {
        throw new AppError("Teacher doesn't exist!!", 404);
    }

    if (req.user.role === 'admin' && createdBy) {
        teacherId = createdBy;
    } else {
        teacherId = req.user.id;
    }

    const course = await CourseModel.create({
        title,
        description,
        price,
        teacherId,
        published: false
    });

    res.status(201).json({
        success: true,
        message: "Course created successfully!!",
        data: course
    });
});

exports.getallCourses = asyncWrapper(async (req, res) => {
    let filter = {};

    if (req.user.role === 'student') {
        filter.published = true;
    }

    const courses = await CourseModel.find(filter)
        .populate('teacherId', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: courses
    });
});

exports.getcoursebyId = asyncWrapper(async (req, res) => {
    const {courseId}=req.params;

    const course = await CourseModel.findById(courseId)
        .populate('teacherId', 'name email');

    if (!course) {
        throw new AppError("Course not found!!", 404);
    }

    if (!course.published && req.user.role === 'student') {
        throw new AppError("You dont have access to this course details!! It is yet to be published", 403);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

exports.updateCourse = asyncWrapper(async (req, res) => {
    const {courseId}=req.params;

    const course = await CourseModel.findById(courseId);

    if (!course) {
        throw new AppError("Course not found!!", 404);
    }

    if (course.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new AppError("You are not authorized to update this course", 403);
    }

    const allowedchanges = ['title', 'description', 'price'];

    allowedchanges.forEach(attribute => {
        if (req.body[attribute] !== undefined) {
            course[attribute] = req.body[attribute];
        }
    });

    await course.save();

    res.status(200).json({
        success: true,
        message: "Course updated successfully!!",
        data: course
    });
});

exports.deleteCourse = asyncWrapper(async (req, res) => {
    const {courseId}=req.params;

    const course = await CourseModel.findById(courseId);

    if (!course) {
        throw new AppError("Course not found!!", 404);
    }

    if (course.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new AppError("You are not authorized to delete a course!!", 403);
    }

    await course.remove();

    res.status(200).json({
        success: true,
        message: "Course deleted successfully!!"
    });
});

exports.publishstatusChange = asyncWrapper(async (req, res) => {
    const {courseId}=req.params;

    const course = await CourseModel.findById(courseId);

    if (!course) {
        throw new AppError("Course not found!!!", 404);
    }

    if (course.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new AppError("You are not authorized to make the changes!!!", 403);
    }

    course.published = !course.published;

    await course.save();

    res.status(200).json({
        success: true,
        message: course.published
            ? "The course has been published and now can be seen by students"
            : "Course has been unpublished and now hidden",
        data: course
    });
});