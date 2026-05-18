require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../src/models/product");

const productTemplates = [
  {
    category: "Chuột Gaming Wireless",
    categorySlug: "chuot-gaming-wireless",
    brand: "Logitech",
    connectivity: "Wireless",
    basePrice: 3290000,
    priceStep: 140000,
    soldBase: 220,
    soldStep: 17,
    viewBase: 1300,
    viewStep: 120,
    dpi: 26000,
    weight: 63,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
    names: [
      "Logitech G Pro X Superlight 2",
      "Logitech G502 X Lightspeed",
      "Logitech G309 Lightspeed",
    ],
  },
  {
    category: "Chuột Công Thái Học",
    categorySlug: "chuot-cong-thai-hoc",
    brand: "Razer",
    connectivity: "Wireless",
    basePrice: 2490000,
    priceStep: 110000,
    soldBase: 160,
    soldStep: 13,
    viewBase: 980,
    viewStep: 95,
    dpi: 30000,
    weight: 88,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    names: [
      "Razer DeathAdder V3 Pro",
      "Razer Basilisk V3 Pro",
      "Razer Pro Click Mini",
    ],
  },
  {
    category: "Chuột Học Tập Và Văn Phòng",
    categorySlug: "chuot-hoc-tap-va-van-phong",
    brand: "Rapoo",
    connectivity: "Wireless",
    basePrice: 490000,
    priceStep: 60000,
    soldBase: 90,
    soldStep: 11,
    viewBase: 640,
    viewStep: 70,
    dpi: 1600,
    weight: 74,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1586349906319-48d20e9d17e5?auto=format&fit=crop&w=1200&q=80",
    names: [
      "Rapoo M650 Silent",
      "Rapoo MT550 Multi-Mode",
      "Rapoo M300 Silent",
    ],
  },
  {
    category: "Bàn Phím Cơ Wireless",
    categorySlug: "ban-phim-co-wireless",
    brand: "Keychron",
    connectivity: "Wireless",
    basePrice: 2190000,
    priceStep: 180000,
    soldBase: 185,
    soldStep: 15,
    viewBase: 1180,
    viewStep: 105,
    dpi: 0,
    weight: 920,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    names: [
      "Keychron K8 Pro RGB",
      "Keychron K6 Hot Swap",
      "Keychron V1 Max",
    ],
  },
  {
    category: "Bàn Phím Cơ Học Tập",
    categorySlug: "ban-phim-co-hoc-tap",
    brand: "Akko",
    connectivity: "Wired",
    basePrice: 1590000,
    priceStep: 90000,
    soldBase: 128,
    soldStep: 12,
    viewBase: 760,
    viewStep: 82,
    dpi: 0,
    weight: 780,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80",
    names: [
      "Akko 5075B Plus",
      "Akko 3068B Plus",
      "Akko MOD 007B HE",
    ],
  },
  {
    category: "Bàn Phím Gaming Wired",
    categorySlug: "ban-phim-gaming-wired",
    brand: "Corsair",
    connectivity: "Wired",
    basePrice: 2890000,
    priceStep: 150000,
    soldBase: 142,
    soldStep: 14,
    viewBase: 890,
    viewStep: 88,
    dpi: 0,
    weight: 1080,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
    names: [
      "Corsair K70 RGB Pro",
      "Corsair K65 RGB Mini",
      "Corsair K100 Air",
    ],
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildProducts = () =>
  productTemplates.flatMap((template, groupIndex) =>
    template.names.map((name, itemIndex) => {
      const order = groupIndex * 3 + itemIndex + 1;
      const price = template.basePrice + itemIndex * template.priceStep;
      const originalPrice = price + 350000 + groupIndex * 90000;
      const sold = template.soldBase + itemIndex * template.soldStep;
      const viewCount = template.viewBase + itemIndex * template.viewStep;

      return {
        id: `seed-product-${order}`,
        slug: slugify(name),
        name,
        category: template.category,
        categorySlug: template.categorySlug,
        brand: template.brand,
        price,
        originalPrice,
        stock: 10 + order * 2,
        sold,
        viewCount,
        rating: Math.min(5, template.rating + itemIndex * 0.05),
        isNew: order % 4 === 0 || order >= 15,
        isBestSeller: sold >= 170,
        promotion: `Phiên bản ${template.connectivity.toLowerCase()} phù hợp cho học tập, làm việc và gaming mỗi ngày.`,
        connectivity: template.connectivity,
        dpi: template.dpi,
        weight: template.weight + itemIndex * 6,
        description: `${name} mang lại trải nghiệm ổn định, hoàn thiện tốt và phù hợp để kiểm thử giao diện danh sách sản phẩm.`,
        features: [
          template.connectivity,
          `Bảo hành ${12 + itemIndex * 6} tháng`,
          itemIndex % 2 === 0 ? "Switch êm" : "Phản hồi nhanh",
        ],
        images: [template.image],
      };
    }),
  );

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    const products = buildProducts();

    await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { slug: product.slug },
          update: { $set: product },
          upsert: true,
        },
      })),
      { ordered: false },
    );

    console.log(`Seeded ${products.length} sample products successfully.`);
  } catch (error) {
    console.error("Failed to seed products:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
