const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        product: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          images: [String],
          slug: String,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "MOMO", "VNPAY"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    status: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6],
      default: 1,
    },
    cancelRequest: {
      isRequested: { type: Boolean, default: false },
      requestedAt: { type: Date },
      reason: { type: String, default: "" },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    },
    statusTimeline: [
      {
        status: { type: Number },
        changedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
