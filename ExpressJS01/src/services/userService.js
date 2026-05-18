require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, allowedRoles } = require("../models/user");
const { normalizeRole } = require("../middleware/auth");

const saltRounds = 10;

const toPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: normalizeRole(user.role),
  phone: user.phone || "",
  address: user.address || "",
  avatar: user.avatar || "",
  bio: user.bio || "",
  dateOfBirth: user.dateOfBirth,
  gender: user.gender || "Other",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const createUserService = async (name, email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existedUser = await User.findOne({ email: normalizedEmail });

    if (existedUser) {
      return null;
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const result = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword,
      role: "user",
    });

    return toPublicUser(result);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return {
        EC: 1,
        EM: "Email hoac mat khau khong hop le",
      };
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        EC: 2,
        EM: "Email hoac mat khau khong hop le",
      };
    }

    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: normalizeRole(user.role),
    };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
      algorithm: "HS256",
    });

    return {
      EC: 0,
      EM: "Dang nhap thanh cong",
      access_token,
      user: toPublicUser(user),
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 99,
      EM: "Co loi xay ra khi dang nhap",
    };
  }
};

const getUserService = async () => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    return users.map(toPublicUser);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getProfileService = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return null;
    }

    return toPublicUser(user);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateProfileService = async (userId, payload) => {
  try {
    const updates = {};
    const allowedFields = ["name", "phone", "address", "avatar", "bio", "dateOfBirth", "gender"];

    allowedFields.forEach((field) => {
      if (payload[field] !== undefined) {
        updates[field] = payload[field];
      }
    });

    if (updates.name) {
      updates.name = updates.name.trim();
    }

    if (updates.dateOfBirth === "") {
      updates.dateOfBirth = null;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return null;
    }

    return toPublicUser(updatedUser);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const forgotPasswordService = async (email) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    await User.findOne({ email: normalizedEmail });

    return {
      EC: 0,
      EM: "If the email exists, a password reset request has been recorded.",
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 2,
      EM: "An error occurred while processing the request.",
    };
  }
};

module.exports = {
  allowedRoles,
  createUserService,
  loginService,
  getUserService,
  getProfileService,
  updateProfileService,
  forgotPasswordService,
};
