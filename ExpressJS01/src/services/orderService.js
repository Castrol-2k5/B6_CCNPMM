const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

// Hàm phụ để kiểm tra và tự động cập nhật đơn hàng ở trạng thái 1 (mới) thành 2 (đã xác nhận) sau 30 phút.
const autoConfirmOrders = async (orders) => {
  const now = new Date();
  const updatedOrders = [];

  for (let order of orders) {
    if (order.status === 1) {
      const diffTime = Math.abs(now - order.createdAt); // tính bằng ms
      const diffMinutes = diffTime / (1000 * 60);

      if (diffMinutes > 30) {
        order.status = 2;
        const timelineItem = {
          status: 2,
          changedAt: now,
          note: "Đơn hàng được hệ thống tự động xác nhận sau 30 phút đặt đơn thành công.",
        };
        order.statusTimeline.push(timelineItem);
        
        // Sử dụng updateOne thay cho save() để tránh CastError khi userId đã được populate
        await Order.updateOne(
          { _id: order._id },
          {
            $set: { status: 2 },
            $push: { statusTimeline: timelineItem }
          }
        );
      }
    }
    updatedOrders.push(order);
  }
  return updatedOrders;
};

const createOrderService = async (userId, shippingAddress, paymentMethod) => {
  try {
    const { name, phone, address } = shippingAddress;
    if (!name || !phone || !address) {
      return {
        EC: 2,
        EM: "Thông tin nhận hàng (Tên, SĐT, Địa chỉ) không được để trống",
      };
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return {
        EC: 3,
        EM: "Giỏ hàng của bạn đang trống, không thể thanh toán",
      };
    }

    // Kiểm tra tồn kho sản phẩm trước khi tạo đơn
    for (const item of cart.items) {
      const product = item.productId;
      if (!product) {
        return {
          EC: 4,
          EM: "Có sản phẩm trong giỏ hàng không tồn tại trên hệ thống",
        };
      }
      if (product.stock < item.quantity) {
        return {
          EC: 5,
          EM: `Sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm trong kho. Vui lòng giảm số lượng.`,
        };
      }
    }

    // Tính tổng tiền đơn hàng
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          slug: product.slug,
        },
        quantity: item.quantity,
      });
    }

    // Xác định trạng thái thanh toán ban đầu
    // Ví điện tử MoMo/VNPay giả lập đã thanh toán trực tiếp từ UI
    const paymentStatus = paymentMethod === "COD" ? "Pending" : "Paid";

    // Tạo đơn hàng mới
    const newOrder = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress: { name, phone, address },
      paymentMethod,
      paymentStatus,
      status: 1, // Đơn hàng mới
      statusTimeline: [
        {
          status: 1,
          note: "Đơn hàng đã được đặt thành công.",
        },
      ],
    });

    // Cập nhật stock & sold của sản phẩm
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    // Làm trống giỏ hàng của người dùng
    cart.items = [];
    await cart.save();

    return {
      EC: 0,
      EM: "Đặt hàng thành công",
      data: newOrder,
    };
  } catch (error) {
    console.error("Error in createOrderService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi tạo đơn hàng",
    };
  }
};

const getOrdersService = async (userId) => {
  try {
    let orders = await Order.find({ userId }).sort({ createdAt: -1 });
    // Tự động kiểm tra cập nhật trạng thái đơn hàng (1 -> 2)
    orders = await autoConfirmOrders(orders);

    return {
      EC: 0,
      EM: "Lấy lịch sử đơn hàng thành công",
      data: orders,
    };
  } catch (error) {
    console.error("Error in getOrdersService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi lấy danh sách đơn hàng",
    };
  }
};

const getOrderDetailService = async (userId, orderId, isAdmin = false) => {
  try {
    let order = await Order.findById(orderId);
    if (!order) {
      return {
        EC: 2,
        EM: "Không tìm thấy đơn hàng",
      };
    }

    // Nếu không phải là admin và đơn hàng không thuộc về user hiện tại
    if (!isAdmin && order.userId.toString() !== userId.toString()) {
      return {
        EC: 3,
        EM: "Bạn không có quyền xem đơn hàng này",
      };
    }

    // Tự động check & confirm nếu đơn ở trạng thái 1 và tạo quá 30 phút
    const now = new Date();
    if (order.status === 1) {
      const diffTime = Math.abs(now - order.createdAt);
      const diffMinutes = diffTime / (1000 * 60);

      if (diffMinutes > 30) {
        order.status = 2;
        const timelineItem = {
          status: 2,
          changedAt: now,
          note: "Đơn hàng được hệ thống tự động xác nhận sau 30 phút đặt đơn thành công.",
        };
        order.statusTimeline.push(timelineItem);
        
        await Order.updateOne(
          { _id: order._id },
          {
            $set: { status: 2 },
            $push: { statusTimeline: timelineItem }
          }
        );
      }
    }

    return {
      EC: 0,
      EM: "Lấy thông tin chi tiết đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    console.error("Error in getOrderDetailService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi xem chi tiết đơn hàng",
    };
  }
};

const cancelOrderService = async (userId, orderId, reason) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        EC: 2,
        EM: "Không tìm thấy đơn hàng",
      };
    }

    if (order.userId.toString() !== userId.toString()) {
      return {
        EC: 3,
        EM: "Bạn không có quyền hủy đơn hàng này",
      };
    }

    const now = new Date();
    const diffTime = Math.abs(now - order.createdAt);
    const diffMinutes = diffTime / (1000 * 60);

    // TH1: Đơn hàng ở trạng thái 1 hoặc 2 và thời gian < 30 phút -> HỦY TRỰC TIẾP
    if ((order.status === 1 || order.status === 2) && diffMinutes <= 30) {
      order.status = 6; // Hủy đơn hàng
      order.paymentStatus = "Failed";
      order.statusTimeline.push({
        status: 6,
        changedAt: now,
        note: `Đơn hàng đã được khách hàng hủy trực tiếp. Lý do: ${reason || "Không có lý do"}`,
      });

      // Hoàn lại tồn kho và giảm sold
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity;
          product.sold = Math.max(0, product.sold - item.quantity);
          await product.save();
        }
      }

      await order.save();
      return {
        EC: 0,
        EM: "Hủy đơn hàng thành công, số lượng sản phẩm đã được hoàn trả lại kho",
        data: order,
      };
    }

    // TH2: Đơn hàng ở bước 3 (Shop đang chuẩn bị hàng) -> GỬI YÊU CẦU HỦY
    if (order.status === 3) {
      if (order.cancelRequest?.isRequested) {
        return {
          EC: 4,
          EM: "Bạn đã gửi yêu cầu hủy đơn trước đó rồi, vui lòng chờ shop phê duyệt",
        };
      }

      order.cancelRequest = {
        isRequested: true,
        requestedAt: now,
        reason: reason || "Yêu cầu hủy đơn",
        status: "Pending",
      };

      order.statusTimeline.push({
        status: order.status,
        changedAt: now,
        note: `Khách hàng gửi yêu cầu hủy đơn hàng. Lý do: ${reason || "Không có lý do"}`,
      });

      await order.save();
      return {
        EC: 0,
        EM: "Yêu cầu hủy đơn đã được gửi tới shop. Vui lòng chờ shop phê duyệt.",
        data: order,
      };
    }

    // TH3: Đã quá 30 phút hoặc ở trạng thái 4, 5, 6
    if (order.status === 6) {
      return {
        EC: 5,
        EM: "Đơn hàng này vốn đã được hủy",
      };
    }

    return {
      EC: 6,
      EM: "Không thể hủy đơn hàng. Đơn hàng đã giao/thành công hoặc đã quá thời gian 30 phút được phép tự hủy.",
    };
  } catch (error) {
    console.error("Error in cancelOrderService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi hủy đơn hàng",
    };
  }
};

// ======================== ADMIN SERVICES ========================

const getAdminOrdersService = async () => {
  try {
    let orders = await Order.find({}).populate("userId", "name email").sort({ createdAt: -1 });
    orders = await autoConfirmOrders(orders);

    return {
      EC: 0,
      EM: "Lấy danh sách đơn hàng cho Admin thành công",
      data: orders,
    };
  } catch (error) {
    console.error("Error in getAdminOrdersService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi lấy danh sách đơn hàng của hệ thống",
    };
  }
};

const updateOrderStatusByAdminService = async (orderId, newStatus) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        EC: 2,
        EM: "Không tìm thấy đơn hàng cần cập nhật",
      };
    }

    const currentStatus = order.status;
    if (currentStatus === 6) {
      return {
        EC: 3,
        EM: "Đơn hàng đã bị hủy, không thể thay đổi trạng thái khác",
      };
    }

    const statusNotes = {
      2: "Đơn hàng đã được xác nhận bởi cửa hàng.",
      3: "Shop đang chuẩn bị đóng gói hàng hóa.",
      4: "Đơn hàng đã được giao cho đơn vị vận chuyển và đang giao.",
      5: "Đơn hàng đã được giao thành công.",
      6: "Đơn hàng đã bị hủy bởi quản trị viên.",
    };

    const note = statusNotes[newStatus] || `Thay đổi trạng thái đơn hàng thành ${newStatus}.`;

    order.status = newStatus;
    if (newStatus === 5) {
      order.paymentStatus = "Paid"; // Đã thanh toán khi giao thành công (COD)
    }

    // Nếu admin hủy đơn hàng
    if (newStatus === 6) {
      order.paymentStatus = "Failed";
      // Hoàn trả kho
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity;
          product.sold = Math.max(0, product.sold - item.quantity);
          await product.save();
        }
      }
    }

    order.statusTimeline.push({
      status: newStatus,
      changedAt: new Date(),
      note: note,
    });

    await order.save();

    return {
      EC: 0,
      EM: "Cập nhật trạng thái đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    console.error("Error in updateOrderStatusByAdminService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
    };
  }
};

const handleCancelRequestByAdminService = async (orderId, action) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        EC: 2,
        EM: "Không tìm thấy đơn hàng",
      };
    }

    if (!order.cancelRequest?.isRequested) {
      return {
        EC: 3,
        EM: "Đơn hàng không có yêu cầu hủy nào cần xử lý",
      };
    }

    if (order.cancelRequest.status !== "Pending") {
      return {
        EC: 4,
        EM: "Yêu cầu hủy đơn này đã được xử lý từ trước",
      };
    }

    const now = new Date();

    if (action === "approve") {
      // Chấp nhận hủy đơn
      order.status = 6; // Hủy đơn
      order.paymentStatus = "Failed";
      order.cancelRequest.status = "Approved";

      // Hoàn trả kho
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity;
          product.sold = Math.max(0, product.sold - item.quantity);
          await product.save();
        }
      }

      order.statusTimeline.push({
        status: 6,
        changedAt: now,
        note: "Yêu cầu hủy đơn đã được shop phê duyệt. Đơn hàng chuyển sang trạng thái Hủy.",
      });

      await order.save();
      return {
        EC: 0,
        EM: "Đã phê duyệt hủy đơn hàng thành công, số lượng sản phẩm được hoàn lại kho",
        data: order,
      };
    } else if (action === "reject") {
      // Từ chối hủy đơn, đơn hàng tiếp tục ở bước 3
      order.cancelRequest.status = "Rejected";
      order.statusTimeline.push({
        status: order.status,
        changedAt: now,
        note: "Shop đã từ chối yêu cầu hủy đơn của khách hàng. Đơn hàng tiếp tục chuẩn bị giao.",
      });

      await order.save();
      return {
        EC: 0,
        EM: "Đã từ chối yêu cầu hủy đơn hàng, đơn tiếp tục xử lý",
        data: order,
      };
    } else {
      return {
        EC: 5,
        EM: "Hành động xử lý (action) không hợp lệ. Phải là 'approve' hoặc 'reject'",
      };
    }
  } catch (error) {
    console.error("Error in handleCancelRequestByAdminService:", error);
    return {
      EC: 1,
      EM: "Có lỗi xảy ra khi xử lý yêu cầu hủy đơn",
    };
  }
};

module.exports = {
  createOrderService,
  getOrdersService,
  getOrderDetailService,
  cancelOrderService,
  getAdminOrdersService,
  updateOrderStatusByAdminService,
  handleCancelRequestByAdminService,
};
