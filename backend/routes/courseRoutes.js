const express=require('express');
const { protect } = require('../middlewares/authmiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { createCourse, getallCourses, getcoursebyId, updateCourse, deleteCourse, publishstatusChange } = require('../controllers/courseControllers');
const { validate } = require('../middlewares/validate');
const { createCourseSchema, updateCourseSchema, courseIdParam } = require('../validators/courseValidator');
const router=express.Router();

router.use(protect)

router.post('/',validate(createCourseSchema),authorize('teacher','admin'),createCourse);
router.get('/',getallCourses);
router.patch('/:courseId/publish',validate(courseIdParam,"params"),authorize('teacher','admin'),publishstatusChange);//here we tried to keep the more specific route first
router.get('/:courseId',validate(courseIdParam,"params"),getcoursebyId);
router.patch('/:courseId',validate(courseIdParam,"params"),validate(updateCourseSchema),authorize('teacher','admin'),updateCourse);
router.delete('/:courseId',validate(courseIdParam,"params"),authorize('teacher','admin'),deleteCourse);


module.exports=router;
