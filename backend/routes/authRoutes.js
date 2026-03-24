const express=require("express");
const { signup, signin } = require("../controllers/authControllers");
const { validate } = require("../middlewares/validate");
const { signupSchema, signinSchema } = require("../validators/authValidator");
const router=express.Router();

router.post('/signup',validate(signupSchema),signup);
router.post('/signin',validate(signinSchema),signin);

module.exports= router;