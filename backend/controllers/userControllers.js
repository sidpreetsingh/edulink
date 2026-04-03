const UserModel = require("../models/user");
const bcrypt = require('bcrypt');
const { AppError } = require("../utilities/appError");
const { asyncWrapper } = require("../middlewares/asyncWrapper");
const PurchaseModel = require("../models/purchases");

exports.myprofile = asyncWrapper(async (req, res) => {
    const id = req.user.id;

    const user = await UserModel.findById(id)
        .select('-password')
        .populate('purchasedCoursesId', 'title price')
        .populate('createdCoursesId', 'title price');

    if (!user) {
        throw new AppError("User not found!!", 404);
    }

    res.json(user);
});

exports.updateprofile = asyncWrapper(async (req, res) => {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
        throw new AppError("User not found!!", 404);
    }

    const allowedchanges = ['name', 'email'];

    allowedchanges.forEach(attribute => {
        if (req.body[attribute] !== undefined) {
            user[attribute] = req.body[attribute];
        }
    });



    await user.save();

    const changedUser = user.toObject();
    delete changedUser.password;

    res.status(200).json({
        message: "Updated Successfully!!",
        user: changedUser
    });
});

exports.changepassword = asyncWrapper(async (req, res) => {
    const currentpass = req.body.currentpassword;
    const newpass = req.body.newpassword;

    if (!currentpass || !newpass) {
        throw new AppError("Both current password and new password are required!!", 400);
    }

    const user = await UserModel.findById(req.user.id);

    const passcheck = await bcrypt.compare(currentpass, user.password);

    if (!passcheck) {
        throw new AppError("Current password is wrong!!", 400);
    }

    user.password = await bcrypt.hash(newpass, 10);

    await user.save();

    res.json({ message: "Password changed successfully!!!" });
});

// now only for admin access!!!!

exports.getAllUsers = asyncWrapper(async (req, res) => {
    const users = await UserModel.find()
        .select('-password')
        .populate('purchasedCoursesId', 'title')
        .populate('createdCoursesId', 'title');

    res.status(200).json({
        success: true,
        data: users
    });
});

exports.deleteUser = asyncWrapper(async (req, res) => {
    const { userId } = req.params;
  
    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found!", 404);
    }
  
    try {
      // Delete all purchases related to this user
      await PurchaseModel.deleteMany({ userId: userId });
  
      // Delete the user
      await UserModel.findByIdAndDelete(userId);
  
      res.status(200).json({
        success: true,
        message: "User and all related purchases deleted successfully!",
        data: user
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      throw new AppError("Failed to delete user", 500);
    }
  });

exports.changeRole = asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new AppError("User not found!!", 404);
    }

    user.role = role;

    await user.save();

    res.json({
        message: "User role updated",
        user
    });
});
