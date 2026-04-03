const express=require('express');
const { protect } = require('../middlewares/authmiddleware');
const { createPurchase, purchasedCourses, getEnrollments, checkPurchases, getTeacherEnrollments } = require('../controllers/purchaseControllers');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validate');
const { courseIdParam } = require('../validators/purchaseValidator');
const router=express.Router();

router.use(protect);

router.post('/:courseId',validate(courseIdParam,"params"),createPurchase);
router.get('/',purchasedCourses);
router.get('/enrollments', authorize('teacher','admin'), getTeacherEnrollments);
router.get('/:courseId/check-purchase', validate(courseIdParam,"params"), checkPurchases);
router.get('/:courseId', validate(courseIdParam, "params"), authorize('teacher','admin'), getEnrollments);


module.exports=router;