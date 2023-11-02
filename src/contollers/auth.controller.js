const { userService, emailService, verifyOtpService } = require("../services");
const ejs = require("ejs");
const path = require("path");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const jwtSecrectKey = "cdccsvavsvfssbtybnjnuki";
const fs = require("fs");
const User = require("../models/user.model");

/* -------------------------- REGISTER/CREATE USER -------------------------- */
const register = async (req, res) => {
  // const { email, password, role } = req.body;
  console.log(req.body);
  const reqBody = req.body;
  if (req.file) {
    reqBody.profile_img = req.file.filename;
  } else {
    throw new Error("Product image is required!");
  }
  const existingUser = await userService.findUserByEmail(reqBody.email);

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists.",
    });
  }

  const hashPassword = await bcrypt.hash(reqBody.password, 8);

  let option = {
    email: reqBody.email,
    role: reqBody.role,
    exp: moment().add(1, "days").unix(),
  };

  const token = await jwt.sign(option, jwtSecrectKey);

  const filter = {
    ...reqBody,
    // email:reqBody.email,
    // role:reqBody.role,
    password: hashPassword,
    token,
  };
  filter.gender = reqBody.gender;
  filter.hobbies = reqBody.hobbies;
  const data = await userService.createUser(filter, reqBody);

  res.status(200).json({ success: true, data: data });
};

/* -------------------------- LOGIN/SIGNIN USER -------------------------- */
const login = async (req, res) => {
  try {
    // validation;
    const { email, password } = req.body;

    const findUser = await userService.findUserByEmail({ email });

    if (!findUser) throw Error("User not found");

    const successPassword = await bcrypt.compare(password, findUser.password);

    console.log("Input Password:", password);
    console.log("Hashed Password in Database:", findUser.password);

    if (!successPassword) {
      console.log("Password Comparison Failed");
      throw Error("Incorrect password");
    }

    if (!successPassword) throw Error("Incorrect password");

    let option = {
      email,
      role: findUser.role,
      exp: moment().add(1, "days").unix(),
    };

    let token;
    if (findUser && successPassword) {
      token = await jwt.sign(option, jwtSecrectKey);
    }
    let data;
    if (token) {
      data = await userService.findUserAndUpdate(findUser._id, token);
    }
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/* ------------------------------- VERIFY OTP ------------------------------- */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOtpService.findOtpByOtp({ otp });
    console.log("user", user);
    if (!user) {
      throw new Error("Invalid OTP entered!");
    }
    const findEmail = await verifyOtpService.findOtpByEmail({ email });
    console.log("findEmail", findEmail);
    if (!findEmail) {
      throw new Error("User not found");
    }
    findEmail.otp = otp;
    await findEmail.save();
    if (findEmail.otp === otp) {
      return res.status(200).json({
        success: true,
        message: "your otp is right thank you",
        data: user,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/* ----------------------------- CHANGE PASSWORD ---------------------------- */
const changePassword = async (req, res) => {
  try {
    const { oldpass, newpass, confirmpass } = req.body;
    console.log(req.body, "++++++++++++++");
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Verify the old password
    const isPasswordCorrect = await bcrypt.compare(oldpass, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect old password" });
    }
    // Check if the new password and confirm password match
    if (newpass !== confirmpass) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }
    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newpass, 10);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ----------------------------- FORGOT PASSWORD ---------------------------- */
const forgetPassword = async (req, res) => {
  try {
    const { email, user_name } = req.body;
    const findUser = await userService.findUserByEmail({ email });
    console.log(findUser);
    if (!findUser) throw Error("User not found");
    const otp = ("0".repeat(4) + Math.floor(Math.random() * 10 ** 4)).slice(-4);
    findUser.otp = otp;
    await findUser.save();
    ejs.renderFile(
      path.join(__dirname, "../views/otp-template.ejs"),
      {
        email: email,
        otp: otp,
        user_name: user_name,
      },
      async (err, data) => {
        if (err) {
          let userCreated = await userService.findUserByEmail(email);
          if (userCreated) {
            await userService.deleteUserByEmail(email);
          }
          throw new Error("Something went wrong, please try again.");
        } else {
          emailService.sendMail(email, data, "Verify Email");
        }
      }
    );
    res.status(200).json({
      success: true,
      message: "User login successfully!",
      // data: { data },
      data: `user otp is stored ${otp}`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ----------------------------- RESET PASSWORD ----------------------------- */
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }
    const user = await userService.findUserByEmail({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 8);
    await userService.updatePassword(user._id, hashPassword);
    // Optionally, you can add more password validation logic here.
    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  verifyOtp,
  forgetPassword,
  resetPassword,
  changePassword,
};
