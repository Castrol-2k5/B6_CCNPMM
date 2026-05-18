require("dotenv").config();
const bcrypt = require("bcrypt");
const { User, allowedRoles } = require("../models/user");
const Product = require("../models/product");
const { normalizeRole } = require("../middleware/auth");

const saltRounds = 10;

const getAllUsers = async () => {
  return User.find({}).select("-password").sort({ createdAt: -1 });
};

const updateUserRole = async (userId, payload) => {
  const allowedFields = ["name", "phone", "address", "avatar", "bio", "dateOfBirth", "gender", "role"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined && payload[field] !== null) {
      updates[field] = payload[field];
    }
  });

  if (updates.role) {
    updates.role = normalizeRole(updates.role);
    if (!allowedRoles.includes(updates.role)) {
      return null;
    }
  }

  return User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");
};

const deleteUserById = async (userId) => {
  return User.findByIdAndDelete(userId);
};

const getAllProducts = async () => {
  return Product.find({}).lean();
};

const createProduct = async (payload) => {
  const normalized = {
    id: payload.id || payload.slug || `prod-${Date.now()}`,
    slug: payload.slug?.trim(),
    name: payload.name?.trim(),
    category: payload.category?.trim(),
    categorySlug: payload.categorySlug?.trim(),
    brand: payload.brand?.trim(),
    price: Number(payload.price) || 0,
    originalPrice: Number(payload.originalPrice) || 0,
    stock: Number(payload.stock) || 0,
    sold: Number(payload.sold) || 0,
    rating: Number(payload.rating) || 0,
    isNew: payload.isNew === true || payload.isNew === "true",
    isBestSeller: payload.isBestSeller === true || payload.isBestSeller === "true",
    promotion: payload.promotion?.trim() || "",
    connectivity: payload.connectivity?.trim() || "",
    dpi: Number(payload.dpi) || 0,
    weight: Number(payload.weight) || 0,
    description: payload.description?.trim() || "",
    features: Array.isArray(payload.features)
      ? payload.features.map((item) => item.toString().trim()).filter(Boolean)
      : String(payload.features || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    images: Array.isArray(payload.images)
      ? payload.images.map((item) => item.toString().trim()).filter(Boolean)
      : String(payload.images || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
  };

  return Product.create(normalized);
};

const updateProduct = async (productId, payload) => {
  const updates = {};
  const allowedFields = [
    "id",
    "slug",
    "name",
    "category",
    "categorySlug",
    "brand",
    "price",
    "originalPrice",
    "stock",
    "sold",
    "rating",
    "isNew",
    "isBestSeller",
    "promotion",
    "connectivity",
    "dpi",
    "weight",
    "description",
    "features",
    "images",
  ];

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined && payload[field] !== null) {
      updates[field] = payload[field];
    }
  });

  if (updates.features) {
    updates.features = Array.isArray(updates.features)
      ? updates.features.map((item) => item.toString().trim()).filter(Boolean)
      : String(updates.features)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
  }

  if (updates.images) {
    updates.images = Array.isArray(updates.images)
      ? updates.images.map((item) => item.toString().trim()).filter(Boolean)
      : String(updates.images)
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
  }

  if (updates.price !== undefined) updates.price = Number(updates.price) || 0;
  if (updates.originalPrice !== undefined) updates.originalPrice = Number(updates.originalPrice) || 0;
  if (updates.stock !== undefined) updates.stock = Number(updates.stock) || 0;
  if (updates.sold !== undefined) updates.sold = Number(updates.sold) || 0;
  if (updates.rating !== undefined) updates.rating = Number(updates.rating) || 0;
  if (updates.dpi !== undefined) updates.dpi = Number(updates.dpi) || 0;
  if (updates.weight !== undefined) updates.weight = Number(updates.weight) || 0;
  updates.isNew = updates.isNew === true || updates.isNew === "true" ? true : updates.isNew === false || updates.isNew === "false" ? false : updates.isNew;
  updates.isBestSeller = updates.isBestSeller === true || updates.isBestSeller === "true" ? true : updates.isBestSeller === false || updates.isBestSeller === "false" ? false : updates.isBestSeller;

  return Product.findByIdAndUpdate(productId, updates, {
    new: true,
    runValidators: true,
  }).lean();
};

const deleteProduct = async (productId) => {
  return Product.findByIdAndDelete(productId);
};

const seedAdminIfNeeded = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gear.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    return existingAdmin;
  }

  const normalizedEmail = adminEmail.trim().toLowerCase();
  const hashPassword = await bcrypt.hash(adminPassword, saltRounds);

  const createdAdmin = await User.create({
    name: "Administrator",
    email: normalizedEmail,
    password: hashPassword,
    role: "admin",
  });

  console.log(`Seeded admin user: ${normalizedEmail}`);
  return createdAdmin;
};

const seedDemoUserIfNeeded = async () => {
  const userEmail = process.env.DEMO_USER_EMAIL || "user@gear.local";
  const userPassword = process.env.DEMO_USER_PASSWORD || "user123";

  const normalizedEmail = userEmail.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return existingUser;
  }

  const hashPassword = await bcrypt.hash(userPassword, saltRounds);

  const createdUser = await User.create({
    name: "Demo User",
    email: normalizedEmail,
    password: hashPassword,
    role: "user",
  });

  console.log(`Seeded demo user: ${normalizedEmail}`);
  return createdUser;
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUserById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedAdminIfNeeded,
  seedDemoUserIfNeeded,
};
