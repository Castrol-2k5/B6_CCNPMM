const products = require("../data/products");

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
    case "newest":
      return cloned.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id.localeCompare(a.id));
    default:
      return cloned.sort((a, b) => b.rating - a.rating);
  }
};

const getProducts = (req, res) => {
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
  } = req.query;

  let filtered = [...products];
  const searchTerm = normalizeText(search);

  if (searchTerm) {
    filtered = filtered.filter((item) => {
      const haystack = [
        item.name,
        item.brand,
        item.category,
        item.description,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchTerm);
    });
  }

  if (category) {
    filtered = filtered.filter(
      (item) => item.categorySlug === normalizeText(category)
    );
  }

  if (brand) {
    filtered = filtered.filter(
      (item) => normalizeText(item.brand) === normalizeText(brand)
    );
  }

  if (connectivity) {
    filtered = filtered.filter(
      (item) => normalizeText(item.connectivity) === normalizeText(connectivity)
    );
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

  const categories = [...new Set(products.map((item) => item.categorySlug))].map(
    (slug) => {
      const found = products.find((item) => item.categorySlug === slug);
      return {
        slug,
        name: found.category,
      };
    }
  );

  const brands = [...new Set(products.map((item) => item.brand))];

  return res.status(200).json({
    EC: 0,
    data: sortProducts(filtered, sort),
    filterMeta: {
      total: filtered.length,
      categories,
      brands,
      connectivity: ["Wireless", "Wired"],
    },
  });
};

const getProductDetail = (req, res) => {
  const product = products.find((item) => item.slug === req.params.slug);

  if (!product) {
    return res.status(404).json({
      EC: 1,
      EM: "Không tìm thấy sản phẩm",
    });
  }

  const similarProducts = products.filter(
    (item) =>
      item.slug !== product.slug &&
      (item.categorySlug === product.categorySlug || item.brand === product.brand)
  );

  return res.status(200).json({
    EC: 0,
    data: {
      ...product,
      similarProducts: similarProducts.slice(0, 4),
    },
  });
};

const getCategories = (req, res) => {
  const categories = [...new Map(
    products.map((item) => [
      item.categorySlug,
      {
        slug: item.categorySlug,
        name: item.category,
      },
    ])
  ).values()];

  return res.status(200).json({
    EC: 0,
    data: categories,
  });
};

module.exports = {
  getProducts,
  getProductDetail,
  getCategories,
};
