const {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeCartItemService,
} = require("../services/cartService");

const getCart = async (req, res) => {
  const result = await getCartService(req.user._id);
  return res.status(200).json(result);
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) {
    return res.status(400).json({
      EC: 1,
      EM: "Mã sản phẩm (productId) là bắt buộc",
    });
  }

  const qty = parseInt(quantity) || 1;
  const result = await addToCartService(req.user._id, productId, qty);
  return res.status(200).json(result);
};

const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || isNaN(quantity)) {
    return res.status(400).json({
      EC: 1,
      EM: "Số lượng (quantity) là bắt buộc và phải là số hợp lệ",
    });
  }

  const result = await updateCartItemService(req.user._id, productId, parseInt(quantity));
  return res.status(200).json(result);
};

const removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const result = await removeCartItemService(req.user._id, productId);
  return res.status(200).json(result);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
