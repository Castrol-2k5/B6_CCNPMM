const Product = require("../models/product");

const normalizeText = (value = "") => value.toString().trim().toLowerCase();

const sortProducts = (items, sortBy) => {
  const cloned = [...items];

  switch (sortBy) {
    case "price_asc":
      return cloned.sort((a, b) => a.price - b.price);
    case "price_desc":
      return cloned.sort((a, b) => b.price - a.price);
    case "sold_desc":
      return cloned.sort((a, b) => b.sold - a.sold);
    case "view_desc":
      return cloned.sort((a, b) => b.viewCount - a.viewCount);
    case "newest":
      return cloned.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id.localeCompare(a.id));
    default:
      return cloned.sort((a, b) => b.rating - a.rating);
  }
};

const getProducts = async (req, res) => {
  const {
    search = "",
    category = "",
    brand = "",
    connectivity = "",
    minPrice,
    maxPrice,
    inStock,
    featured,
    sort = "popular",
    page = 1,
    limit = 12,
  } = req.query;

  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Math.min(50, Number(limit) || 12));

  try {
    const allProducts = await Product.find({}).lean();
    let filtered = [...allProducts];
    const searchTerm = normalizeText(search);

    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const haystack = [item.name, item.brand, item.category, item.description].join(" ").toLowerCase();
        return haystack.includes(searchTerm);
      });
    }

    if (category) {
      filtered = filtered.filter((item) => item.categorySlug === normalizeText(category));
    }

    if (brand) {
      filtered = filtered.filter((item) => normalizeText(item.brand) === normalizeText(brand));
    }

    if (connectivity) {
      filtered = filtered.filter((item) => normalizeText(item.connectivity) === normalizeText(connectivity));
    }

    if (minPrice) {
      filtered = filtered.filter((item) => item.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((item) => item.price <= Number(maxPrice));
    }

    if (inStock === "true") {
      filtered = filtered.filter((item) => item.stock > 0);
    }

    if (featured === "new") {
      filtered = filtered.filter((item) => item.isNew);
    }

    if (featured === "best") {
      filtered = filtered.filter((item) => item.isBestSeller);
    }

    const categories = [...new Map(
      allProducts.map((item) => [
        item.categorySlug,
        {
          slug: item.categorySlug,
          name: item.category,
        },
      ]),
    ).values()];

    const brands = [...new Set(allProducts.map((item) => item.brand))];
    const connectivityOptions = [...new Set(allProducts.map((item) => item.connectivity))];

    const sortedProducts = sortProducts(filtered, sort);
    const totalProducts = sortedProducts.length;
    const paginatedProducts = sortedProducts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    const totalPages = Math.ceil(totalProducts / pageSize);

    return res.status(200).json({
      EC: 0,
      data: paginatedProducts,
      filterMeta: {
        total: totalProducts,
        categories,
        brands,
        connectivity: connectivityOptions,
      },
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalPages,
        hasMore: pageNumber < totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: 1,
      EM: "Khong the lay danh sach san pham",
    });
  }
};

const getProductHighlights = async (req, res) => {
  const {
    type = "sold",
    page = 1,
    limit = 5,
    total = 10,
  } = req.query;

  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Math.min(10, Number(limit) || 5));
  const totalLimit = Math.max(1, Math.min(20, Number(total) || 10));
  const sortKey = type === "view" ? "view_desc" : "sold_desc";

  try {
    const allProducts = await Product.find({}).lean();
    const highlightProducts = sortProducts(allProducts, sortKey).slice(0, totalLimit);
    const totalItems = highlightProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(pageNumber, totalPages);
    const paginatedProducts = highlightProducts.slice(
      (safePage - 1) * pageSize,
      safePage * pageSize,
    );

    return res.status(200).json({
      EC: 0,
      data: paginatedProducts,
      pagination: {
        page: safePage,
        limit: pageSize,
        totalItems,
        totalPages,
        hasMore: safePage < totalPages,
      },
      meta: {
        type,
        totalLimit,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: 1,
      EM: "Khong the lay danh sach noi bat",
    });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).lean();

    if (!product) {
      return res.status(404).json({
        EC: 1,
        EM: "Khong tim thay san pham",
      });
    }

    const similarProducts = await Product.find({
      slug: { $ne: product.slug },
      $or: [{ categorySlug: product.categorySlug }, { brand: product.brand }],
    })
      .limit(4)
      .lean();

    return res.status(200).json({
      EC: 0,
      data: {
        ...product,
        similarProducts,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: 1,
      EM: "Khong the lay chi tiet san pham",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    const categories = [...new Map(
      products.map((item) => [
        item.categorySlug,
        {
          slug: item.categorySlug,
          name: item.category,
        },
      ]),
    ).values()];

    return res.status(200).json({
      EC: 0,
      data: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: 1,
      EM: "Khong the lay danh muc",
    });
  }
};

module.exports = {
  getProducts,
  getProductHighlights,
  getProductDetail,
  getCategories,
};
