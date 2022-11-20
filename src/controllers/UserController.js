const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// registation
exports.register = async (req, res, next) => {
  const { email, firstName, lastName, password, mobile, photo } = req.body;
  try {
    const user = new User({
      email,
      firstName,
      lastName,
      password,
      mobile,
      photo,
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: err.message,
    });
  }
};

// login
exports.login = async (req, res, next) => {
  let body = req.body;
  try {
    let user = await User.aggregate([
      { $match: { email: body.email } },
      {
        $project: {
          _id: 0,
          email: 1,
          firstName: 1,
          lastName: 1,
          photo: 1,
          mobile: 1,
        },
      },
    ]);

    if (user.length == 0) {
      return res.status(401).json({
        success: "fail",
        status: "Unauthorized",
      });
    }

    let playload = {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
      data: user[0]["email"],
    };

    let token = jwt.sign(playload, "swttoken123456");
    res.status(200).json({
      success: "success",
      data: user[0],
      token,
    });
  } catch (err) {
    res.status(400).json({
      success: "fail",
      data: err.message,
    });
  }
};

// update
exports.updateProfile = async (req, res, next) => {
  let email = req.email;
  try {
    await User.findOneAndUpdate({ email: email }, req.body);
    res.status(200).json({
      success: "success",
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: "fail",
      message: err.message,
    });
  }
};
