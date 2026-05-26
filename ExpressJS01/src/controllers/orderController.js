const {
  createOrderService,
  getOrdersService,
  getOrderDetailService,
  cancelOrderService,
  getAdminOrdersService,
  updateOrderStatusByAdminService,
  handleCancelRequestByAdminService,
} = require("../services/orderService");

const createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({
      EC: 1,
      EM: "Thông tin giao hàng (shippingAddress) và phương thức thanh toán (paymentMethod) là bắt buộc",
    });
  }

  const result = await createOrderService(req.user._id, shippingAddress, paymentMethod);
  return res.status(200).json(result);
};

const getOrders = async (req, res) => {
  const result = await getOrdersService(req.user._id);
  return res.status(200).json(result);
};

const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user.role === "admin";
  const result = await getOrderDetailService(req.user._id, id, isAdmin);
  return res.status(200).json(result);
};

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const result = await cancelOrderService(req.user._id, id, reason);
  return res.status(200).json(result);
};

// ======================== ADMIN CONTROLLERS ========================

const getAdminOrders = async (req, res) => {
  const result = await getAdminOrdersService();
  return res.status(200).json(result);
};

const updateOrderStatusByAdmin = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === undefined || isNaN(status)) {
    return res.status(400).json({
      EC: 1,
      EM: "Trạng thái mới (status) là số hợp lệ là bắt buộc",
    });
  }

  const result = await updateOrderStatusByAdminService(id, parseInt(status));
  return res.status(200).json(result);
};

const handleCancelRequestByAdmin = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' hoặc 'reject'

  if (!action || !["approve", "reject"].includes(action)) {
    return res.status(400).json({
      EC: 1,
      EM: "Hành động xử lý (action) phải là 'approve' hoặc 'reject'",
    });
  }

  const result = await handleCancelRequestByAdminService(id, action);
  return res.status(200).json(result);
};

module.exports = {
  createOrder,
  getOrders,
  getOrderDetail,
  cancelOrder,
  getAdminOrders,
  updateOrderStatusByAdmin,
  handleCancelRequestByAdmin,
};
