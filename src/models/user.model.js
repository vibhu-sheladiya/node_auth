const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const userSchema = new mongoose.Schema(
  {
    // user name
    user_name: {
      type: String,
      trim: true,
    },
    // user email
    email: {
      type: String,
      trim: true,
    },
    // phone of the user
    phone: {
      type: Number,
      trim: true,
    },
    // password of the user
    password: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    hobbies: {
      type: Array,
    },
    // address of the user
    address: {
      type: String,
      trim: true,
    },
    profile_img: {
      type: String,
      trim: true,
    },
    // country india of the user
    country_india: {
      type: String,
      default: "india",
    },
    // role of the user
    role: {
      type: String,
      enum: ["admin", "user", "subadmin"], // 1-admin  2 -user   3-superadmin
    },
    otp: {
      type: String,
    },
    token: {
      type: String,
    },

    // isVerified:{
    //   type : Boolean ,
    //   default : false
    //   }
    newPassword: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, data) {
        if (data?.profile_img) {
          data.profile_img = `${config.base_url}profiles/${data.profile_img}`;
        }
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified || !this.isNew) {
    next();
  } else this.isModified("password");
  // if (this.password)
    // this.password = await bcrypt.hash(String(this.password), 12);
  // next();
});
const User = mongoose.model("user", userSchema);
module.exports = User;
