const {
  getAllUsers,
  updateUserRole,
  deleteUserById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/adminService");

const getAdminUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ EC: 0, data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: 1, EM: "Khong the lay danh sach nguoi dung" });
  }
};

const updateAdminUser = async (req, res) => {
  try {
    const updatedUser = await updateUserRole(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(400).json({ EC: 1, EM: "Cap nhat thong tin nguoi dung khong hop le" });
    }
    return res.status(200).json({ EC: 0, data: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: 1, EM: "Khong the cap nhat nguoi dung" });
  }
};

const deleteAdminUser = async (req, res) => {
  try {
    const deleted = await deleteUserById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ EC: 1, EM: "Nguoi dung khong ton tai" });
    }
    return res.status(200).json({ EC: 0, EM: "Xoa nguoi dung thanh cong" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: 1, EM: "Khong the xoa nguoi dung" });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json({ EC: 0, data: products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: 1, EM: "Khong the lay danh sach san pham" });
  }
};

const createAdminProduct = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    return res.status(201).json({ EC: 0, EM: "Tao san pham thanh cong", data: product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: 1, EM: "Khong the tao san pham" });
  }
};

const updateAdminProduct = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ EC: 1, EM: "San pham khong ton tai hoac du lieu khong hop le" });
    }
    return res.status(200).json({ EC: 0, EM: "Cap nhat san pham thanh cong", data: product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: 1, EM: "Khong the cap nhat san pham" });
  }
};

const deleteAdminProduct = async (req, res) => {
  try {
    const deleted = await deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ EC: 1, EM: "San pham khong ton tai" });
    }
    return res.status(200).json({ EC: 0, EM: "Xoa san pham thanh cong" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: 1, EM: "Khong the xoa san pham" });
  }
};

module.exports = {
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
};
