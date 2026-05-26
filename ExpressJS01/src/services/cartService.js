const Cart = require("../models/cart");
const Product = require("../models/product");

const getCartService = async (userId) => {
  try {
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Lọc bỏ những sản phẩm không còn tồn tại trong DB (nếu có)
    const validItems = [];
    let hasChanges = false;

    for (const item of cart.items) {
      if (item.productId) {
        validItems.push(item);
      } else {
        hasChanges = true;
      }
    }

    if (hasChanges) {
      cart.items = validItems;
      await cart.save();
      // Populate lại
      cart = await Cart.findOne({ userId }).populate("items.productId");
    }

    return {
      EC: 0,
      EM: "Lấy giỏ hàng thành công",
      data: cart,
    };
  } catch (error) {
    console.error("Error in getCartService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi lấy thông tin giỏ hàng",
    };
  }
};

const addToCartService = async (userId, productId, quantity) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return {
        EC: 2,
        EM: "Sản phẩm không tồn tại",
      };
    }

    if (product.stock < quantity) {
      return {
        EC: 3,
        EM: `Sản phẩm chỉ còn ${product.stock} sản phẩm trong kho`,
      };
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Đã có trong giỏ hàng, tăng số lượng
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return {
          EC: 3,
          EM: `Tổng số lượng trong giỏ hàng (${newQuantity}) vượt quá tồn kho hiện tại của shop (${product.stock})`,
        };
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // Chưa có trong giỏ hàng, thêm mới
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

    return {
      EC: 0,
      EM: "Đã thêm vào giỏ hàng",
      data: updatedCart,
    };
  } catch (error) {
    console.error("Error in addToCartService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi thêm vào giỏ hàng",
    };
  }
};

const updateCartItemService = async (userId, productId, quantity) => {
  try {
    if (quantity < 1) {
      return {
        EC: 2,
        EM: "Số lượng tối thiểu phải là 1",
      };
    }

    const product = await Product.findById(productId);
    if (!product) {
      return {
        EC: 3,
        EM: "Sản phẩm không tồn tại",
      };
    }

    if (product.stock < quantity) {
      return {
        EC: 4,
        EM: `Sản phẩm chỉ còn ${product.stock} sản phẩm trong kho`,
      };
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return {
        EC: 5,
        EM: "Giỏ hàng không tồn tại",
      };
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return {
        EC: 6,
        EM: "Sản phẩm không có trong giỏ hàng",
      };
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

    return {
      EC: 0,
      EM: "Cập nhật số lượng thành công",
      data: updatedCart,
    };
  } catch (error) {
    console.error("Error in updateCartItemService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi cập nhật giỏ hàng",
    };
  }
};

const removeCartItemService = async (userId, productId) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return {
        EC: 2,
        EM: "Giỏ hàng không tồn tại",
      };
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

    return {
      EC: 0,
      EM: "Đã xóa sản phẩm khỏi giỏ hàng",
      data: updatedCart,
    };
  } catch (error) {
    console.error("Error in removeCartItemService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng",
    };
  }
};

const clearCartService = async (userId) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return {
      EC: 0,
      EM: "Đã xóa toàn bộ giỏ hàng",
    };
  } catch (error) {
    console.error("Error in clearCartService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi xóa toàn bộ giỏ hàng",
    };
  }
};

module.exports = {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
};
