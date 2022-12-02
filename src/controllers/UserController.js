const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const OTP = require("../models/OTP");
const SendEmailUtility = require("../utility/SendEmailUtility");

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

exports.profileDetails = async (req, res) => {
  let email = req.headers["email"];
  try {
    let data = await User.aggregate([
      { $match: { email: email } },
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
          password: 0,
        },
      },
    ]);
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(400).json({ status: "fail", data: err });
  }
};

exports.RecoverVerifyEmail = async (req, res) => {
  let email = req.params.email;
  let OTPCode = Math.floor(100000 + Math.random() * 900000);
  try {
    // Email Account Query
    let UserCount = await User.aggregate([
      { $match: { email: email } },
      { $count: "total" },
    ]);
    if (UserCount.length > 0) {
      // OTP Insert
      let CreateOTP = await OTP.create({ email: email, otp: OTPCode });
      // Email Send
      let SendEmail = await SendEmailUtility(
        email,
        "Your PIN Code is= " + OTPCode,
        "Task Manager PIN Verification"
      );
      res.status(200).json({ status: "success", data: SendEmail });
    } else {
      res.status(200).json({ status: "fail", data: "No User Found" });
    }
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

exports.RecoverVerifyOTP = async (req, res) => {
  let email = req.params.email;
  let OTPCode = req.params.otp;
  let status = 0;
  let statusUpdate = 1;
  try {
    let OTPCount = await OTP.aggregate([
      { $match: { email: email, otp: OTPCode, status: status } },
      { $count: "total" },
    ]);
    if (OTPCount.length > 0) {
      let OTPUpdate = await OTP.updateOne(
        { email: email, otp: OTPCode, status: status },
        {
          email: email,
          otp: OTPCode,
          status: statusUpdate,
        }
      );

      res.status(200).json({ status: "success", data: OTPUpdate });
    } else {
      res.status(200).json({ status: "fail", data: "Invalid OTP Code" });
    }
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

exports.RecoverResetPass = async (req, res) => {
  let email = req.body["email"];
  let OTPCode = req.body["OTP"];
  let NewPass = req.body["password"];
  let statusUpdate = 1;

  try {
    let OTPUsedCount = await OTP.aggregate([
      { $match: { email: email, otp: OTPCode, status: statusUpdate } },
      { $count: "total" },
    ]);
    if (OTPUsedCount.length > 0) {
      let PassUpdate = await User.updateOne(
        { email: email },
        {
          password: NewPass,
        }
      );
      await OTP.deleteOne({ email: email, otp: OTPCode, status: statusUpdate });
      res.status(200).json({ status: "success", data: PassUpdate });
    } else {
      res.status(200).json({ status: "fail", data: "Invalid Request" });
    }
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};
