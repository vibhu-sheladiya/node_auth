const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/config");

const auth = () => async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token, " 8888888  token token token token token token");
    if (!token) {
      return next(
        res.status(401).json({
          status: 401,
          message: "Please authenticate!",
        })
      );
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      config.jwt.secret_key
    );
    console.log(decoded);
    if (!decoded) {
      return next(new Error("Please enter valid token!"));
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return next(new Error("Please authenticate!"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      res.status(401).json({
        status: 400,
        message: error.message,
      })
    );
  }
};

module.exports = auth;
