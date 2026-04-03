const express=require('express');
const { protect } = require('../middlewares/authmiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { createCourse, getallCourses, getcoursebyId, updateCourse, deleteCourse, publishstatusChange, toggleCourseStatus, getTeacherCourses, getTeacherCourseStats } = require('../controllers/courseControllers');
const { validate } = require('../middlewares/validate');
const { createCourseSchema, updateCourseSchema, courseIdParam } = require('../validators/courseValidator');
const router=express.Router();

router.use(protect)

router.post('/',authorize('teacher','admin'),createCourse);
router.get('/',getallCourses);
router.get('/teacher',authorize('teacher'),getTeacherCourses);
router.get('/teacher/stats',authorize('teacher'),getTeacherCourseStats);
router.patch('/:courseId/publish',validate(courseIdParam,"params"),authorize('teacher','admin'),publishstatusChange);
router.patch('/:courseId/status',validate(courseIdParam,"params"),authorize('teacher','admin'),toggleCourseStatus);//here we tried to keep the more specific route first
router.get('/:courseId',validate(courseIdParam,"params"),getcoursebyId);
router.patch('/:courseId',validate(courseIdParam,"params"),validate(updateCourseSchema),authorize('teacher','admin'),updateCourse);
router.delete('/:courseId',validate(courseIdParam,"params"),authorize('teacher','admin'),deleteCourse);



module.exports=router;
