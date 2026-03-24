const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AppError } = require("../utilities/appError");
const { asyncWrapper } = require("../middlewares/asyncWrapper");
const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = asyncWrapper(async (req, res) => {
        const { email, password, name } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new AppError("User already exists!!", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role: "student"
        });

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7h" });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
});

exports.signin = asyncWrapper(async (req, res) => {
    
        const { email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            throw new AppError("Invalid email or password", 401);
        }

        const passcheck = await bcrypt.compare(password, existingUser.password);
        if (!passcheck) {
            throw new AppError("Invalid email or password", 401);
        }

        const token = jwt.sign({ id: existingUser._id, role: existingUser.role, name:existingUser.name }, JWT_SECRET, { expiresIn: "7h" });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            token,
            user: {
                id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
                role: existingUser.role
            }
        });
    
});