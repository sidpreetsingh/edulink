const express=require('express');
const { protect } = require('../middlewares/authmiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { getAllUsers, deleteUser, changeRole } = require('../controllers/userControllers');
const { getallCourses } = require('../controllers/courseControllers');
const { getAllPurchases, getPurchasesOfUser, deletePurchase } = require('../controllers/purchaseControllers');
const { validate } = require('../middlewares/validate');
const { userIdParam, changeRoleSchema, purchIdParam } = require('../validators/adminValidator');
const router=express.Router();

router.use(protect,authorize('admin'));

router.get('/users',getAllUsers);
router.get('/courses',getallCourses);
router.get('/purchases',getAllPurchases);
router.delete('/users/:userId',validate(userIdParam,"params"),deleteUser);
router.patch('/users/:userId/role',validate(userIdParam,"params"),validate(changeRoleSchema),changeRole);
router.get('/purchases/:userId',validate(userIdParam,"params"),getPurchasesOfUser);
router.delete('/purchases/:purchId',validate(purchIdParam,"params"),deletePurchase);

module.exports=router;


