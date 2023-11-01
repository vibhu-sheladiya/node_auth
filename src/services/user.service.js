const { User } = require("../models");

/**create user */
const createUser = async (reqBody) => {
  return User.create(reqBody);
};
/**get user list */
const getUserList = async (req, res) => {
  return User.find();
};
const getAllUser = async (role) => {
  return await User.find(role);
};
/**get user details by id */
const getUserById = async (userId) => {
  return User.findById(userId);
};

/**update user and token */
const updateUser = async (userId, updateBody) => {
  return User.findByIdAndUpdate(userId, { $set: updateBody });
};
const findUserAndUpdate = async (_id, token) => {
  return await User.findByIdAndUpdate(
    { _id },
    {
      $set: { token },
    },
    { new: true }
  );
};
/**delete user */
const deleteUser = async (userId) => {
  return User.findByIdAndDelete(userId);
};
/**email by user */
const findUserByEmail = async (email) => {
  return await User.findOne(email);
};
const findByEmail = async (email) => {
  return await User.findOne({ email });
};
/**find by otp */
const findUserByOtp = async (otp) => {
  return await User.findOne(otp);
};
/**delete user */
const deleteUserByEmail = async (email) => {
  return User.findOneAndDelete({ email: email });
};
/**user update */
const updatePassword = async (userId, newPassword) => {
  return User.findByIdAndUpdate(userId, { password: newPassword });
};
module.exports = {
  createUser,
  getUserList,
  getUserById,
  updateUser,
  deleteUser,
  findUserByOtp,
  findUserByEmail,
  deleteUserByEmail,
  findUserAndUpdate,
  findByEmail,
  updatePassword,
  getAllUser,

};
