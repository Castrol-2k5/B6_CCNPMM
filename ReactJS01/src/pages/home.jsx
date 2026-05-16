import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProductsApi } from "../util/api";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const initialFilters = {
  search: "",
  category: "",
  brand: "",
  connectivity: "",
  minPrice: "",
  maxPrice: "",
  sort: "popular",
  featured: "",
  inStock: false,
};

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    categories: [],
    brands: [],
    connectivity: [],
  });

  useEffect(() => {
    const nextFilters = {
      ...initialFilters,
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      connectivity: searchParams.get("connectivity") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "popular",
      featured: searchParams.get("featured") || "",
      inStock: searchParams.get("inStock") === "true",
    };
    setFilters(nextFilters);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "" && value !== false)
      );
      const res = await getProductsApi(params);
      if (res?.EC === 0) {
        setProducts(res.data);
        setMeta(res.filterMeta);
      }
    };

    fetchProducts();
  }, [filters]);

  const featuredProducts = useMemo(
    () => products.filter((item) => item.isBestSeller).slice(0, 3),
    [products]
  );

  const newestProducts = useMemo(
    () => products.filter((item) => item.isNew).slice(0, 3),
    [products]
  );

  const applyFilter = (next) => {
    const merged = { ...filters, ...next };
    const params = new URLSearchParams();

    Object.entries(merged).forEach(([key, value]) => {
      if (value !== "" && value !== false) {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    applyFilter({ [name]: type === "checkbox" ? checked : value });
  };

  return (
    <main className="pb-14">
      <section className="relative overflow-hidden border-b border-coffee/10 bg-[linear-gradient(135deg,#43210f_0%,#7c2d12_55%,#14532d_100%)] text-white">
        <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200">
              Chuột và bàn phím cho học tập và gaming
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-[0.95] sm:text-5xl">
              Trang chủ bán chuột và bàn phím với khuyến mãi, sản phẩm mới và bán chạy nhất.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-amber-50/90 sm:text-lg">
              Tìm nhanh mẫu chuột hoặc bàn phím phù hợp theo giá, thương hiệu, kết nối và nhu cầu. Sau khi đăng nhập với vai trò thành viên, hệ thống hiển thị thông tin tài khoản và ưu đãi dành riêng.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => applyFilter({ featured: "best" })}
                className="rounded-full bg-white px-5 py-3 text-sm font-extrabold text-coffee transition hover:-translate-y-0.5"
              >
                Xem bán chạy nhất
              </button>
              <button
                type="button"
                onClick={() => applyFilter({ featured: "new" })}
                className="rounded-full border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Xem hàng mới
              </button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[475px] rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-md lg:mx-0">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-100">
                  Thành viên đăng nhập
                </p>
                <p className="mt-1 text-xs leading-6 text-white/70">
                  Khu vực tài khoản và ưu đãi dành riêng
                </p>
              </div>
              {isAuthenticated ? (
                <span className="shrink-0 rounded-full border border-emerald-200/30 bg-emerald-300/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-100">
                  Đang hoạt động
                </span>
              ) : null}
            </div>

            {isAuthenticated ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-[24px] bg-white/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    Họ tên
                  </p>
                  <p className="mt-2 text-xl font-extrabold leading-tight text-white">
                    {user?.name || "Thành viên"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1.45fr_0.85fr]">
                  <div className="min-w-0 rounded-[24px] bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                      Email
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold leading-6 text-white">
                      {user?.email}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                      Vai trò
                    </p>
                    <p className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
                      {user?.role || "member"}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] bg-gradient-to-r from-amber-300/15 to-lime-300/15 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
                    Ưu đãi thành viên
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/90">
                    Giảm thêm 5% cho đơn hàng chuột và bàn phím gaming trong tuần này, đồng thời ưu tiên nhận thông tin hàng mới.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="rounded-[24px] bg-white/10 p-4 text-sm leading-6 text-amber-50/90">
                  Đăng nhập với vai trò thành viên để xem thông tin tài khoản, đăng xuất và nhận ưu đãi riêng trên trang chủ.
                </p>
                <Link
                  to="/login"
                  className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-extrabold text-coffee transition hover:-translate-y-0.5"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <aside className="rounded-[28px] border border-coffee/10 bg-white p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-coffee">Tìm kiếm và lọc</h2>
            <button
              type="button"
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-sm font-bold text-copper"
            >
              Xóa lọc
            </button>
          </div>

          <div className="space-y-4">
            <input
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Tìm chuột, bàn phím, thương hiệu..."
              className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
            >
              <option value="">Tất cả danh mục</option>
              {meta.categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              name="brand"
              value={filters.brand}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
            >
              <option value="">Tất cả thương hiệu</option>
              {meta.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <select
              name="connectivity"
              value={filters.connectivity}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
            >
              <option value="">Mọi kết nối</option>
              {meta.connectivity.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="minPrice"
                value={filters.minPrice}
                onChange={handleInputChange}
                placeholder="Giá từ"
                className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
              />
              <input
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleInputChange}
                placeholder="Giá đến"
                className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
              />
            </div>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-coffee/10 px-4 py-3 outline-none transition focus:border-coffee"
            >
              <option value="popular">Nổi bật</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="sold_desc">Bán chạy nhất</option>
              <option value="newest">Mới nhất</option>
            </select>
            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
              <input
                type="checkbox"
                name="inStock"
                checked={filters.inStock}
                onChange={handleInputChange}
              />
              Chỉ hiển thị sản phẩm còn hàng
            </label>
          </div>
        </aside>

        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-[28px] border border-coffee/10 bg-white p-6 shadow-soft lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-copper">
                    Kết quả tìm kiếm
                  </p>
                  <h2 className="text-2xl font-extrabold text-coffee">
                    {meta.total} sản phẩm phù hợp
                  </h2>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[24px] border border-coffee/10 bg-slate-50"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-44 w-full object-cover"
                    />
                    <div className="space-y-3 p-4">
                      <div className="flex flex-wrap gap-2">
                        {product.isNew ? (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                            Mới
                          </span>
                        ) : null}
                        {product.isBestSeller ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                            Bán chạy
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] uppercase leading-5 tracking-[0.16em] text-slate-500">
                        {product.brand} • {product.category}
                      </p>
                      <h3 className="min-h-[84px] text-[1.7rem] font-extrabold leading-10 text-coffee">
                        {product.name}
                      </h3>
                      <p className="min-h-[96px] text-sm leading-7 text-slate-600">
                        {product.promotion}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xl font-black text-copper">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-sm text-slate-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </p>
                        <p className="pt-1 text-sm font-medium text-slate-500">
                          Đã bán {product.sold} sản phẩm
                        </p>
                      </div>
                      <Link
                        to={`/products/${product.slug}`}
                        className="inline-flex w-full justify-center rounded-full bg-coffee px-4 py-3 text-sm font-extrabold text-white transition hover:bg-copper"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-[28px] border border-coffee/10 bg-white p-6 shadow-soft">
                <p className="text-sm uppercase tracking-[0.25em] text-copper">
                  Khuyến mãi
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-coffee">
                  Giảm 5% cho thành viên
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Áp dụng cho chuột và bàn phím wireless từ 2 triệu trở lên khi đăng nhập thành công.
                </p>
              </div>
              <div className="rounded-[28px] border border-coffee/10 bg-white p-6 shadow-soft">
                <p className="text-sm uppercase tracking-[0.25em] text-copper">
                  Mới nhất
                </p>
                <div className="mt-4 space-y-4">
                  {newestProducts.map((item) => (
                    <Link key={item.id} to={`/products/${item.slug}`} className="block rounded-2xl bg-slate-50 p-4">
                      <p className="font-extrabold text-coffee">{item.name}</p>
                      <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-[28px] border border-coffee/10 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-copper">
                  Bán chạy nhất
                </p>
                <h2 className="text-2xl font-extrabold text-coffee">Top chuột và bàn phím được mua nhiều</h2>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {featuredProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.slug}`}
                  className="rounded-[24px] bg-[linear-gradient(135deg,#fff7ed_0%,#ecfccb_100%)] p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-copper">
                    {item.brand}
                  </p>
                  <h3 className="mt-2 text-lg font-extrabold text-coffee">{item.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">Đã bán {item.sold} sản phẩm</p>
                  <p className="mt-4 text-xl font-black text-pine">
                    {formatCurrency(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
