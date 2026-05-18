const {
  createUserService,
  loginService,
  getUserService,
  getProfileService,
  updateProfileService,
  forgotPasswordService,
} = require("../services/userService");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);

  if (!data) {
    return res.status(400).json({
      EC: 1,
      EM: "Khong the tao tai khoan. Email co the da ton tai.",
    });
  }

  return res.status(200).json({
    EC: 0,
    EM: "Tao tai khoan thanh cong",
    data,
  });
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);
  return res.status(200).json(data);
};

const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data);
};

const getAccount = async (req, res) => {
  const profile = await getProfileService(req.user._id);

  if (!profile) {
    return res.status(404).json({
      EC: 1,
      EM: "Khong tim thay tai khoan",
    });
  }

  return res.status(200).json(profile);
};

const getProfile = async (req, res) => {
  const profile = await getProfileService(req.user._id);

  if (!profile) {
    return res.status(404).json({
      EC: 1,
      EM: "Khong tim thay ho so",
    });
  }

  return res.status(200).json({
    EC: 0,
    data: profile,
  });
};

const updateProfile = async (req, res) => {
  const updatedProfile = await updateProfileService(req.user._id, req.body);

  if (!updatedProfile) {
    return res.status(400).json({
      EC: 1,
      EM: "Khong the cap nhat ho so",
    });
  }

  return res.status(200).json({
    EC: 0,
    EM: "Cap nhat ho so thanh cong",
    data: updatedProfile,
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const data = await forgotPasswordService(email);
  return res.status(200).json(data);
};

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  getProfile,
  updateProfile,
  forgotPassword,
};
