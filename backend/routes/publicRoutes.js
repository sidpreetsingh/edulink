const express=require('express');
const { allCoursesPublic, viewCoursePublic } = require('../controllers/publicControllers');
const { validate } = require('../middlewares/validate');
const { courseIdParam } = require('../validators/publicValidator');
const router=express.Router();

router.get('/',allCoursesPublic);
router.get('/:courseId',
    validate(courseIdParam,"params"),
    viewCoursePublic);

module.exports=router;