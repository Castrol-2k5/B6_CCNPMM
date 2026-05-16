require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      return null;
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const result = await User.create({
      name,
      email,
      password: hashPassword,
      role: "member",
    });

    return {
      _id: result._id,
      name: result.name,
      email: result.email,
      role: result.role,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        EC: 1,
          EM: "Email/Mật khẩu không hợp lệ",
      };
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        EC: 2,
          EM: "Email/Mật khẩu không hợp lệ",
      };
    }

    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || "member",
    };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return {
      EC: 0,
      EM: "Đăng nhập thành công",
      access_token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || "member",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 99,
      EM: "Có lỗi xảy ra khi đăng nhập",
    };
  }
};

const getUserService = async () => {
  try {
    return await User.find({}).select("-password");
  } catch (error) {
    console.log(error);
    return null;
  }
};

const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        EC: 1,
        EM: "Email không tồn tại",
      };
    }

    return {
      EC: 0,
      EM: "Yêu cầu khôi phục đã được ghi nhận",
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 2,
      EM: "Có lỗi xảy ra",
    };
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  forgotPasswordService,
};
