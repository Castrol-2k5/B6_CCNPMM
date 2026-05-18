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
    items: [
      {
        name: "Logitech G Pro X Superlight 2",
        images: [
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1613141412501-9012977f1969?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Logitech G502 X Lightspeed",
        images: [
          "https://images.unsplash.com/photo-1563297007-0686b7003af7?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1586349906319-48d20e9d17e5?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Logitech G309 Lightspeed",
        images: [
          "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1629429407756-01cd3d7cfb38?auto=format&fit=crop&w=1200&q=80",
        ],
      },
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
    items: [
      {
        name: "Razer DeathAdder V3 Pro",
        images: [
          "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Razer Basilisk V3 Pro",
        images: [
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1625750331870-624de6fd3451?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1613141412501-9012977f1969?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Razer Pro Click Mini",
        images: [
          "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1629429407756-01cd3d7cfb38?auto=format&fit=crop&w=1200&q=80",
        ],
      },
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
    items: [
      {
        name: "Rapoo M650 Silent",
        images: [
          "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Rapoo MT550 Multi-Mode",
        images: [
          "https://images.unsplash.com/photo-1613141412501-9012977f1969?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1625750331870-624de6fd3451?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Rapoo M300 Silent",
        images: [
          "https://images.unsplash.com/photo-1563297007-0686b7003af7?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=1200&q=80",
        ],
      },
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
    items: [
      {
        name: "Keychron K8 Pro RGB",
        images: [
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Keychron K6 Hot Swap",
        images: [
          "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Keychron V1 Max",
        images: [
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80",
        ],
      },
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
    items: [
      {
        name: "Akko 5075B Plus",
        images: [
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Akko 3068B Plus",
        images: [
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Akko MOD 007B HE",
        images: [
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
        ],
      },
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
    items: [
      {
        name: "Corsair K70 RGB Pro",
        images: [
          "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Corsair K65 RGB Mini",
        images: [
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Corsair K100 Air",
        images: [
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
        ],
      },
    ],
  },
  {
    category: "Chuột Gaming Wired",
    categorySlug: "chuot-gaming-wired",
    brand: "Fantech",
    connectivity: "Wired",
    basePrice: 890000,
    priceStep: 90000,
    soldBase: 110,
    soldStep: 10,
    viewBase: 700,
    viewStep: 75,
    dpi: 19000,
    weight: 69,
    rating: 4.5,
    items: [
      {
        name: "Fantech Helios II Pro",
        images: [
          "https://images.unsplash.com/photo-1629429407756-01cd3d7cfb38?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Fantech Aria XD7",
        images: [
          "https://images.unsplash.com/photo-1625750331870-624de6fd3451?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1563297007-0686b7003af7?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Fantech Crypto VX7",
        images: [
          "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1629429407756-01cd3d7cfb38?auto=format&fit=crop&w=1200&q=80",
        ],
      },
    ],
  },
  {
    category: "Bàn Phím Gaming Wireless",
    categorySlug: "ban-phim-gaming-wireless",
    brand: "Aula",
    connectivity: "Wireless",
    basePrice: 1290000,
    priceStep: 100000,
    soldBase: 95,
    soldStep: 9,
    viewBase: 680,
    viewStep: 68,
    dpi: 0,
    weight: 820,
    rating: 4.5,
    items: [
      {
        name: "Aula F75 Gasket",
        images: [
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Aula F87 Pro",
        images: [
          "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80",
        ],
      },
      {
        name: "Aula WIN68 HE",
        images: [
          "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
        ],
      },
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
    template.items.map((item, itemIndex) => {
      const order = groupIndex * 3 + itemIndex + 1;
      const price = template.basePrice + itemIndex * template.priceStep;
      const originalPrice = price + 350000 + groupIndex * 90000;
      const sold = template.soldBase + itemIndex * template.soldStep;
      const viewCount = template.viewBase + itemIndex * template.viewStep;

      return {
        id: `seed-product-${order}`,
        slug: slugify(item.name),
        name: item.name,
        category: template.category,
        categorySlug: template.categorySlug,
        brand: template.brand,
        price,
        originalPrice,
        stock: 10 + order * 2,
        sold,
        viewCount,
        rating: Math.min(5, template.rating + itemIndex * 0.05),
        isNew: order % 4 === 0 || order >= 18,
        isBestSeller: sold >= 170,
        promotion: `Phiên bản ${template.connectivity.toLowerCase()} phù hợp cho học tập, làm việc và gaming mỗi ngày.`,
        connectivity: template.connectivity,
        dpi: template.dpi,
        weight: template.weight + itemIndex * 6,
        description: `${item.name} mang lại trải nghiệm ổn định, hoàn thiện tốt và phù hợp để kiểm thử giao diện danh sách sản phẩm.`,
        features: [
          template.connectivity,
          `Bảo hành ${12 + itemIndex * 6} tháng`,
          itemIndex % 2 === 0 ? "Switch êm" : "Phản hồi nhanh",
        ],
        images: item.images,
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
