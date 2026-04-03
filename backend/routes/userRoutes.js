const express=require('express');
const { protect } = require('../middlewares/authmiddleware');
const { myprofile, updateprofile, changepassword } = require('../controllers/userControllers');
const { validate } = require('../middlewares/validate');
const  upload  = require('../middlewares/fileuploadMiddleware');
const { updateUserSchema, changePasswordSchema } = require('../validators/userValidator');
const router=express.Router();

router.use(protect) //this uses the protect middleware in every route below...

router.get('/my-profile',myprofile);
router.patch('/my-profile',validate(updateUserSchema),upload.single('profileImage'),updateprofile);
router.patch('/change-password',validate(changePasswordSchema),changepassword);

module.exports= router