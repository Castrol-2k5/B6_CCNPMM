import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProductHighlightsApi, getProductsApi } from "../util/api";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);

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

const PRODUCTS_PER_PAGE = 6;
const HIGHLIGHT_PAGE_SIZE = 5;
const HIGHLIGHT_TOTAL = 10;

const sectionTitles = {
  sold: {
    eyebrow: "Bán chạy nhất",
    title: "Top 10 sản phẩm bán chạy",
    subtitle: "Phân trang ngang theo 5 sản phẩm mỗi lần để duyệt nhanh.",
    cardClass: "bg-[linear-gradient(135deg,#fff7ed_0%,#ecfccb_100%)]",
    accentClass: "text-copper",
    metric: (item) => `Đã bán ${item.sold} sản phẩm`,
  },
  view: {
    eyebrow: "Nhiều lượt xem nhất",
    title: "Top 10 sản phẩm được xem nhiều",
    subtitle: "Danh sách được lấy riêng từ API và chuyển trang ngay trên home.",
    cardClass: "bg-[linear-gradient(135deg,#eff6ff_0%,#c7d2fe_100%)]",
    accentClass: "text-blue-600",
    metric: (item) => `${item.viewCount ?? 0} lượt xem`,
  },
};

const ProductCard = ({ product }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-coffee/10 bg-slate-50">
    <img
      src={product.images?.[0]}
      alt={product.name}
      className="h-56 w-full flex-shrink-0 object-cover"
    />
    <div className="flex flex-1 flex-col justify-between p-6">
      <div>
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
          {product.stock > 0 ? (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
              Còn hàng
            </span>
          ) : (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
              Hết hàng
            </span>
          )}
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {product.brand} • {product.category}
        </p>
        <h3 className="mt-3 text-[1.7rem] font-extrabold leading-tight text-coffee">
          {product.name}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {product.promotion || product.description || "Sản phẩm phù hợp cho học tập, làm việc và gaming."}
        </p>
      </div>

      <div className="mt-5">
        <div className="space-y-1">
          <p className="text-2xl font-black text-copper">{formatCurrency(product.price)}</p>
          <p className="text-sm text-slate-400 line-through">
            {formatCurrency(product.originalPrice)}
          </p>
          <p className="pt-1 text-sm font-medium text-slate-500">
            Đã bán {product.sold} sản phẩm
          </p>
        </div>

        <Link
          to={`/products/${product.slug}`}
          className="mt-4 inline-flex w-full justify-center rounded-full bg-coffee px-4 py-3 text-sm font-extrabold text-white transition hover:bg-copper"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  </article>
);

const HighlightSection = ({
  titleKey,
  items,
  page,
  totalPages,
  loading,
  onPrev,
  onNext,
}) => {
  const config = sectionTitles[titleKey];

  return (
    <section className="rounded-[28px] border border-coffee/10 bg-white p-6 shadow-soft">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-copper">{config.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-coffee">{config.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{config.subtitle}</p>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <button
            type="button"
            onClick={onPrev}
            disabled={page <= 1 || loading}
            className="rounded-full border border-coffee/10 bg-slate-100 px-4 py-2 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>
          <span className="min-w-14 text-center font-semibold">
            {page}/{totalPages}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={page >= totalPages || loading}
            className="rounded-full border border-coffee/10 bg-slate-100 px-4 py-2 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {loading
          ? Array.from({ length: HIGHLIGHT_PAGE_SIZE }).map((_, index) => (
              <div key={index} className="h-[210px] animate-pulse rounded-[24px] bg-slate-100" />
            ))
          : items.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.slug}`}
                className={`flex h-full flex-col justify-between rounded-[24px] p-5 shadow-sm transition hover:-translate-y-1 ${config.cardClass}`}
              >
                <div>
                  <p className={`text-xs uppercase tracking-[0.2em] ${config.accentClass}`}>
                    {item.brand}
                  </p>
                  <h3 className="mt-2 text-lg font-extrabold text-coffee">{item.name}</h3>
                  <p className="mt-3 text-sm text-slate-600">{config.metric(item)}</p>
                </div>
                <p className="mt-4 text-xl font-black text-pine">{formatCurrency(item.price)}</p>
              </Link>
            ))}
      </div>
    </section>
  );
};

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    categories: [],
    brands: [],
    connectivity: [],
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [topSellingPage, setTopSellingPage] = useState(1);
  const [mostViewedPage, setMostViewedPage] = useState(1);
  const [topSellingState, setTopSellingState] = useState({
    items: [],
    totalPages: 1,
    loading: false,
  });
  const [mostViewedState, setMostViewedState] = useState({
    items: [],
    totalPages: 1,
    loading: false,
  });
  const loadMoreRef = useRef(null);

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
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [searchParams]);

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "" && value !== false),
      );
      params.page = page;
      params.limit = PRODUCTS_PER_PAGE;

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await getProductsApi(params);

      if (!ignore) {
        if (res?.EC === 0) {
          setProducts((prev) => {
            const incoming = Array.isArray(res.data) ? res.data : [];
            if (page === 1) return incoming;
            const merged = new Map(prev.map((item) => [item.id, item]));
            incoming.forEach((item) => merged.set(item.id, item));
            return [...merged.values()];
          });
          setMeta(
            res.filterMeta || {
              total: 0,
              categories: [],
              brands: [],
              connectivity: [],
            },
          );
          setHasMore(Boolean(res.pagination?.hasMore));
        } else if (page === 1) {
          setProducts([]);
          setMeta((prev) => ({ ...prev, total: 0 }));
          setHasMore(false);
        }

        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [filters, page]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || loading || loadingMore || !hasMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, products.length]);

  useEffect(() => {
    let ignore = false;

    const fetchHighlights = async () => {
      setTopSellingState((prev) => ({ ...prev, loading: true }));
      const res = await getProductHighlightsApi({
        type: "sold",
        page: topSellingPage,
        limit: HIGHLIGHT_PAGE_SIZE,
        total: HIGHLIGHT_TOTAL,
      });

      if (!ignore) {
        setTopSellingState({
          items: res?.EC === 0 ? res.data || [] : [],
          totalPages: res?.pagination?.totalPages || 1,
          loading: false,
        });
      }
    };

    fetchHighlights();
    return () => {
      ignore = true;
    };
  }, [topSellingPage]);

  useEffect(() => {
    let ignore = false;

    const fetchHighlights = async () => {
      setMostViewedState((prev) => ({ ...prev, loading: true }));
      const res = await getProductHighlightsApi({
        type: "view",
        page: mostViewedPage,
        limit: HIGHLIGHT_PAGE_SIZE,
        total: HIGHLIGHT_TOTAL,
      });

      if (!ignore) {
        setMostViewedState({
          items: res?.EC === 0 ? res.data || [] : [],
          totalPages: res?.pagination?.totalPages || 1,
          loading: false,
        });
      }
    };

    fetchHighlights();
    return () => {
      ignore = true;
    };
  }, [mostViewedPage]);

  const newestProducts = useMemo(
    () => products.filter((item) => item.isNew).slice(0, 3),
    [products],
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
    <main className="overflow-x-hidden pb-14">
      <section className="relative overflow-hidden border-b border-coffee/10 bg-[linear-gradient(135deg,#43210f_0%,#7c2d12_55%,#14532d_100%)] text-white">
        <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="hidden lg:block" />
          <div className="space-y-6 lg:-ml-10 lg:pr-12 xl:-ml-12">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200">
              Chuột và bàn phím cho học tập và gaming
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-[0.95] sm:text-5xl">
              Hệ thống đã phân quyền đăng nhập theo admin, manager và user.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-amber-50/90 sm:text-lg">
              Trang chủ chỉ dành cho tài khoản hợp lệ. Dữ liệu sản phẩm được đọc từ MongoDB và thông tin thành viên
              đã được tách sang trang hồ sơ riêng.
            </p>
            <div className="flex flex-wrap gap-3 lg:pt-1">
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
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <HighlightSection
            titleKey="sold"
            items={topSellingState.items}
            page={topSellingPage}
            totalPages={topSellingState.totalPages}
            loading={topSellingState.loading}
            onPrev={() => setTopSellingPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setTopSellingPage((prev) => Math.min(prev + 1, topSellingState.totalPages))
            }
          />

          <HighlightSection
            titleKey="view"
            items={mostViewedState.items}
            page={mostViewedPage}
            totalPages={mostViewedState.totalPages}
            loading={mostViewedState.loading}
            onPrev={() => setMostViewedPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setMostViewedPage((prev) => Math.min(prev + 1, mostViewedState.totalPages))
            }
          />

          <div className="grid items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)]">
            <aside className="rounded-[28px] border border-coffee/10 bg-white p-5 shadow-soft lg:sticky lg:top-24">
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

            <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
              <section className="min-w-0 rounded-[28px] border border-coffee/10 bg-white p-6 shadow-soft">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-copper">Kết quả tìm kiếm</p>
                    <h2 className="text-2xl font-extrabold text-coffee">
                      {meta.total} sản phẩm phù hợp
                    </h2>
                  </div>
                </div>

                {loading ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                      <div
                        key={index}
                        className="h-[420px] animate-pulse rounded-[24px] bg-slate-100"
                      />
                    ))}
                  </div>
                ) : products.length ? (
                  <>
                    <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    <div ref={loadMoreRef} className="flex min-h-16 items-center justify-center pt-6">
                      {loadingMore ? (
                        <div className="rounded-full border border-coffee/10 bg-sand px-5 py-3 text-sm font-semibold text-coffee">
                          Đang tải thêm sản phẩm...
                        </div>
                      ) : hasMore ? (
                        <div className="text-sm text-slate-500">
                          Kéo xuống cuối trang để tải thêm sản phẩm
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-slate-500">
                          Đã hiển thị hết sản phẩm phù hợp
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-coffee/15 bg-sand p-8 text-center text-slate-600">
                    Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                  </div>
                )}
              </section>

              <section className="min-w-0">
                <div className="rounded-[28px] border border-coffee/10 bg-white p-6 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.25em] text-copper">Mới nhất</p>
                  <div className="mt-4 space-y-4">
                    {newestProducts.length ? (
                      newestProducts.map((item) => (
                        <Link
                          key={item.id}
                          to={`/products/${item.slug}`}
                          className="block rounded-2xl bg-slate-50 p-4"
                        >
                          <p className="font-extrabold text-coffee">{item.name}</p>
                          <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                        Chưa có sản phẩm mới trong tập kết quả hiện tại.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
